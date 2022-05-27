import assert from "assert";
import dotenv from  'dotenv'
import path from "path";
dotenv.config({path: path.join(__dirname, "../.env.test")});


describe("FHIR API", function () {
    describe("Role | Patient", function () {
        describe("Resource | Patient", function () {
            it("Patient should get patient resource with correct API request", function () {
                console.log(process.env)
            });

            it("Patient shouldn't get patient resource because FHIR_ID isn't correct (Not their patient information)", function () {
                //test
            });

            it("Patient shouldn't get patient resource because token isn't correct", function () {
                //test
            });

            it("Patient shouldn't get patient resource because token is expired", function () {
                //test
            });

            it("Patient shouldn't be able to update their own patient resource", function () {
                //test
            });

            it("Patient shouldn't be able to update another patients' resource", function () {
                //test
            });

            it("Patient shouldn't be able to create a patient resource", function () {
                //test
            });

            it("Patient shouldn't be able to delete a patient resource", function () {
                //test
            });

            //History?
            //Search?
        });


        describe("Resource | Observation", function () {
            it("Patient should get observation resource with correct API request", function () {
                //test
            });

            it("Patient shouldn't get observation resource because FHIR_ID isn't correct (Not their observation information)", function () {
                //test
            });

            it("Patient shouldn't be able to update his own observation resource", function () {
                //test
            });

            it("Patient shouldn't be able to update another patients observation resource", function () {
                //test
            });

            it("Patient shouldn't be able to create an observation resource", function () {
                //test
            });
        });
    });

    describe("Role | Admin", function () {
        describe("Resource | Patient", function () {
            it("Admin should get patient resource with correct API request", function () {
                //test
            });

            it("Admin shouldn't get patient resource when token isn't correct", function () {
                //test
            });

            it("Admin shouldn't get patient resource when token is expired", function () {
                //test
            });

            it("Admin should be able to update a patient resource with correct FHIR_ID", function () {
                //test
            });

            it("Admin should be able to create a patient resource", function () {
                //test
            });

            it("Admin should be able to create a patient resource", function () {
                //test
            });
        });
    });

    describe("Role | WildSea", function () {
        describe("Resource | Patient", function () {
            it("", function () {
                //test
            });
        });
    });
});

