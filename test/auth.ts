import assert from "assert";
import {Account, JwtUser, LoginResponse, Tokens, User} from "../src/interface/interfaces";
import jwt from 'jsonwebtoken'
import {truncateEntireAccountsTable} from "../src/database/account_service";
import {login, logout, refreshToken, sendRegister, verifyToken} from "../src/test_handler";
import {generateAccessToken, generateRefreshToken} from "../src/token_handler";

describe("Token", function () {

    describe("Generation", function () {
        let user: User;
        let generatedToken: string;
        let generatedRefreshToken: string;

        before(async function () {
            await truncateEntireAccountsTable();
            user = {email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"};
        });

        beforeEach(function () {
            generatedToken = generateAccessToken(user);
            generatedRefreshToken = generateRefreshToken(user);
        })

        it("Generating access token should return given value", function () {
            const decodedUser = jwt.decode(generatedToken) as JwtUser;
            
            assert.equal(decodedUser.email, "Delano@NoToken")
            assert.equal(decodedUser.fhir_id, "1")
            assert.equal(decodedUser.role, "Patient")
        });

        // it("Generated access token should be verified correctly", async function () {
        //     const verifiedUser: User = await verifyToken(generatedToken) as User;
        //
        //     assert.notEqual(verifiedUser, null)
        //     assert.equal(verifiedUser.email, "Delano@NoToken")
        //     assert.equal(verifiedUser.fhir_id, "1")
        //     assert.equal(verifiedUser.role, "Patient")
        // });

        it("Generated access token that has been manipulated should return 403", async function () {
            generatedToken += "a";

            const verifiedUser = await verifyToken(generatedToken);
            assert.equal(verifiedUser, 403)
        });
    });

    describe("Generation of RefreshToken", function () {
        let user: User;
        let rToken: string;

        before(async function () {
            await truncateEntireAccountsTable();
            user = {email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"};
            await sendRegister(user);
        });

        beforeEach(async function () {
            user.email = "Delano@NoToken";
            rToken = (await login(user)).tokens.rToken;
        })

        // it("Generating refresh token should return given value", async function () {
        //     const loginResponse = await refreshToken(user, rToken) as LoginResponse;
        //     console.log(loginResponse.tokens.token)
        //     const decodedUser = jwt.decode(loginResponse.tokens.token) as JwtUser;
        //
        //     assert.equal(loginResponse.statusCode, 200)
        //     assert.equal(decodedUser.email, "Delano@NoToken")
        //     assert.equal(decodedUser.fhir_id, "1")
        //     assert.equal(decodedUser.role, "Patient")
        // });
        // 
        // it("Should return status code 403 because of a wrong email", async function () {
        //     user.email = "Delano@wrongemail"
        //     const loginResponse = await refreshToken(user, rToken) as LoginResponse;

        //     assert.equal(loginResponse.statusCode, 403)
        // });

        // it("Should return status code 403 because the rToken has been manipulated", async function () {
        //     rToken += "a";
        //     const loginResponse = await refreshToken(user, rToken) as LoginResponse;

        //     assert.equal(loginResponse.statusCode, 403)
        // });
    });
});
