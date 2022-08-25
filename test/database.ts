import assert from "assert";
import {Account, JwtUser, User} from "../src/interface/interfaces";
import jwt from 'jsonwebtoken'
import {truncateEntireAccountsTable} from "../src/database/account_service";
import {login, logout, sendRegister} from "../src/test_handler";

/**
 * The tests in this file tests the database usability
 * The DB is tested on Registering, Valid or unvalid authentication, and returning proper HTTP status codes.
 * 
 * The following tests exists:
 *   should return status code 201 for creating the Patient
 *   should return status code 409 because the email is not unique
 *   should return status code 409 because the fhir_id is not unique
 *   should return status code 403 because the email is empty
 *   should return status code 404 if new user is a Patient with no fhir_id
 *   Should return correct token after correct login
 *   Should return correct RefreshToken after correct login
 *   should return status code 403 because the email is null
 *   should return status code 403 because the email is not correct
 *   should return status code 403 because the password is incorrect
 *   should return status code 200 because the logout was successful
 *   should return status code 404 because the given email is incorrect
 */
describe("Database authentication system ", function () {
    let statusCode: number;

    describe("Register", function () {
        let registerUser: User;

        before(async function () {
            await truncateEntireAccountsTable();
            registerUser = {email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"};
        });

        beforeEach(function () {
            //Increments the fhir_id because it's unique in the DB
            registerUser.fhir_id = (parseInt(registerUser.fhir_id) + 1).toString();
            statusCode = null;
        });

        it("should return status code 201 for creating the Patient", async function () {
            await sendRegister(registerUser, 201).then(code => {
                statusCode = code;
            })

            assert.equal(statusCode, 201);
        });

        it("should return status code 409 because the email is not unique", async function () {
            await sendRegister(registerUser, 409).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 409);
        });

        it("should return status code 409 because the fhir_id is not unique", async function () {
            registerUser.fhir_id = "2";
            registerUser.email = "temp@temp";

            await sendRegister(registerUser, 409).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 409);
        });

        it("should return status code 403 because the email is empty", async function () {
            const tempEmail: string = registerUser.email;
            registerUser.email = null;
            await sendRegister(registerUser, 403).then(code => {
                statusCode = code;
            });

            registerUser.email = tempEmail;
            assert.equal(statusCode, 403);
        });

        it("should return status code 404 if new user is a Patient with no fhir_id", async function () {
            registerUser.fhir_id = null;
            await sendRegister(registerUser, 404).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 404);
        });
    });

    describe("login", function () {
        let loginUser: Account;
        const loggedInUserData = {
            tokens: {token: null, rToken: null},
            user: {email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"}
        };

        before(async function () {
            await truncateEntireAccountsTable();
            await sendRegister(loggedInUserData.user);
        });

        beforeEach(function () {
            /* Deep copy of loggedInUserData */
            loginUser = JSON.parse(JSON.stringify(loggedInUserData));
        });

        it("Should return correct token after correct login", async function () {
            const tokens = (await login(loginUser.user)).tokens;
            const user = jwt.decode(tokens.token) as JwtUser;

            assert.equal(user.email, "Delano@NoToken")
            assert.equal(user.role, "Patient");
        })

        it("Should return correct RefreshToken after correct login", async function () {
            const tokens = (await login(loginUser.user)).tokens;
            const user = jwt.decode(tokens.rToken) as JwtUser;

            assert.equal(user.email, "Delano@NoToken")
            assert.equal(user.role, "Patient");
        });

        it("should return status code 403 because the email is null", async function () {
            loginUser.user.email = null;
            const statusCode = (await login(loginUser.user)).statusCode;

            assert.equal(statusCode, 403);
        });

        it("should return status code 403 because the email is not correct", async function () {
            loginUser.user.email = "ungabunga@uchaucha";
            const statusCode = (await login(loginUser.user)).statusCode;

            assert.equal(statusCode, 403);
        });

        it("should return status code 403 because the password is incorrect", async function () {
            loginUser.user.password = "NotWelcome01";
            const statusCode = (await login(loginUser.user)).statusCode;

            assert.equal(statusCode, 403);
        });
    });

    describe("logout", function () {
        let logoutUser: Account;

        beforeEach(async function () {
            await truncateEntireAccountsTable();
            logoutUser = {user:{ email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"}}
            await sendRegister(logoutUser.user)
            logoutUser.tokens = (await login(logoutUser.user)).tokens;
            statusCode = null;
        });

        it("should return status code 200 because the logout was successful", async function () {
            statusCode = await logout(logoutUser.user, 200)
            assert.equal(statusCode, 200);
        });

        it("should return status code 404 because the given email is incorrect", async function () {
            logoutUser.user.email = "incorrectEmail";
            statusCode = await logout(logoutUser.user, 404)

            assert.equal(statusCode, 404);
        });

    });
});

