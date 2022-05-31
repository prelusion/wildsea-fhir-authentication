import assert from "assert";
import {getPatient} from "../src/fhir/fhir_api_handler";
import {Account} from "../src/interface/interfaces";
import {truncateEntireAccountsTable} from "../src/database/account_service";
import {login, sendRegister} from "../src/test_handler";

describe("FHIR API", function () {
    describe("Role | Patient", function () {
        let patientAccount: Account;

        before(async function () {
            await truncateEntireAccountsTable();
            patientAccount = {user:{ email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient"}}
            await sendRegister(patientAccount.user)
            patientAccount.tokens = (await login(patientAccount.user)).tokens;
        });

        describe("Resource | Patient", function () {
            // it("Patient should get patient resource with correct API request", async function () {
            //    const response = await getPatient(patientAccount);
            //
            //     console.log(response);
            //     assert.equal(response.statusCode, 200);
            // });

            it("Patient shouldn't get patient resource because FHIR_ID isn't correct (Not their patient information)", function () {
                //test


                assert.equal(403, 403);
            });

            it("Patient shouldn't get patient resource because token isn't correct", function () {
                //test


                assert.equal(403, 403);
            });

            it("Patient shouldn't get patient resource because token is expired", function () {
                //test


                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to update their own patient resource", function () {
                //test


                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to update another patients' resource", function () {
                //test

                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to create a patient resource", function () {
                //test

                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to delete a patient resource", function () {
                //test

                assert.equal(403, 403);
            });

            //History?
            //Search?
        });


        describe("Resource | Observation", function () {
            it("Patient should get observation resource with correct API request", function () {
                //test

                assert.equal(403, 200);
            });

            it("Patient shouldn't get observation resource because FHIR_ID isn't correct (Not their observation information)", function () {
                //test

                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to update his own observation resource", function () {
                //test

                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to update another patients observation resource", function () {
                //test

                assert.equal(403, 403);
            });

            it("Patient shouldn't be able to create an observation resource", function () {
                //test

                assert.equal(403, 403);
            });
        });
    });

    describe("Role | Admin", function () {
        describe("Resource | Patient", function () {
            it("Admin should get patient resource with correct API request", function () {
                //test

                assert.equal(403, 200);
            });

            it("Admin shouldn't get patient resource when token isn't correct", function () {
                //test

                assert.equal(403, 403);
            });

            it("Admin shouldn't get patient resource when token is expired", function () {
                //test

                assert.equal(403, 403);
            });

            it("Admin should be able to update a patient resource with correct FHIR_ID", function () {
                //test

                assert.equal(403, 200);
            });

            it("Admin should be able to create a patient resource", function () {
                //test

                assert.equal(403, 200);
            });

            it("Admin should be able to create a patient resource", function () {
                //test

                assert.equal(403, 200);
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

