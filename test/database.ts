import assert from "assert";
import {User} from "../src/interfaces";

describe("Database authentication system ", function () {

    describe("Register", function () {


        it("should return http code 201 for creating the user without the token", function () {

        });

        it("should return http code 201 for creating the user", function () {
            //test
        });

        it("should return http code 409 because the email is not unique", function () {
            //test
        });

        it("should return http code 409 because the username is empty", function () {
            //test
        });

        it("should return http code 404 if new user is a Patient with no fhir_id", function () {
            //test
        });
    });

    describe("login", function () {

        it("Should return correct token after correct login", function () {
            //test
        });

        it("Should return correct RefreshToken after correct login", function () {
            //test
        });

        it("should return http code 403 because the email is null", function () {
            //test
        });

        it("should return http code 403 because the email is not correct", function () {
            //test
        });

        it("should return http code 403 because the password is incorrect", function () {
            //test
        });
    })

    describe("logout", function () {
        it("should return http code 200 because the logout was successful", function () {
            //test
        });

        it("should return http code 500 because the given email is incorrect", function () {
            //test
        });
    })
});

