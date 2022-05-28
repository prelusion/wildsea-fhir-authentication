import assert from "assert";
import {Account, User} from "../src/interfaces";

require("./test_initializer")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../src/index"); // Link to your server file
import supertest from "supertest";
import {truncateEntireAccountsTable} from "../src/database/account_service";
const request = supertest(app);



describe("Database authentication system ", function () {
    let registerUser: User;
    let statusCode: number;
    // before(function () {
    //     // runs once before the first test in this block
    // });
    //
    // after(function () {
    //     // runs once after the last test in this block
    // });
    //
    // beforeEach(function () {
    //     // runs before each test in this block
    // });
    //
    // afterEach(function () {
    //     // runs after each test in this block
    // });
    //

    before(async function () {
        await truncateEntireAccountsTable();
        registerUser = {email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"};
    });

    beforeEach(function () {
        //Increments the fhir_id because it's unique in the DB
        registerUser.fhir_id = (parseInt(registerUser.fhir_id) + 1).toString();
        statusCode = null;
    });

    async function sendRegister (user: User, expectedStatusCode: number, statusCode: number): Promise<number> {
        await request.post("/register")
            .send({
                email: user.email,
                fhir_id: user.fhir_id,
                password: user.password,
                role: user.role
            }).expect(expectedStatusCode)
            .then((res) => {
                statusCode = res.statusCode;
            }).catch((err) => {
                statusCode = err.statusCode;
            });
        return statusCode;
    }


    describe("Register", function () {
        it("should return status code 201 for creating the Patient", async function () {
            await sendRegister(registerUser, 201, statusCode).then(code => {
                statusCode = code;
            })

            assert.equal(statusCode, 201);
        });

        it("should return status code 409 because the email is not unique", async function () {
            await sendRegister(registerUser, 409, statusCode).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 409);
        });

        it("should return status code 409 because the fhir_id is not unique", async function () {
            registerUser.fhir_id = "2";
            registerUser.email = "temp@temp";

            await sendRegister(registerUser, 409, statusCode).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 409);
        });

        it("should return status code 403 because the email is empty", async function () {
            const tempEmail: string = registerUser.email;
            registerUser.email = null;
            await sendRegister(registerUser, 403, statusCode).then(code => {
                statusCode = code;
            });

            registerUser.email = tempEmail;
            assert.equal(statusCode, 403);
        });

        it("should return status code 404 if new user is a Patient with no fhir_id", async function () {
            registerUser.fhir_id = null;
            await sendRegister(registerUser, 404, statusCode).then(code => {
                statusCode = code;
            });

            assert.equal(statusCode, 404);
        });
    });

    describe("login", function () {

        it("Should return correct token after correct login", function () {
            //test
        });

        it("Should return correct RefreshToken after correct login", function () {
            //test
        });

        it("should return status code 403 because the email is null", function () {
            //test
        });

        it("should return status code 403 because the email is not correct", function () {
            //test
        });

        it("should return status code 403 because the password is incorrect", function () {
            //test
        });
    })

    describe("logout", function () {
        it("should return status code 200 because the logout was successful", function () {
            //test
        });

        it("should return status code 500 because the given email is incorrect", function () {
            //test
        });
    })
});

