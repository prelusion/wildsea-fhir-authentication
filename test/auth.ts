import assert from "assert";

describe("Token", function () {

    describe("Authentication", function () {

        it("Should return a user after correctly authentication with a token", function () {
            //test

        });

        it("should return the correct access token & refresh token after login", function () {
            //test

        });

    });

    describe("Generation", function () {

        it("Generating access token should return given value", function () {
            //test

        });

        it("Generating refresh token should return given value", function () {
            //test

        });

        it("Should return http code 403 because refresh token is not the same as the account refresh token because of a wrong email", function () {
            //test

        });

        it("Should return http code 403 because refresh token cannot be verified", function () {
            //test

        });
    });
});
