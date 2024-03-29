import assert from "assert";
import {createResource, deleteResource, getResource, initInstance, updateResource} from "../src/fhir/fhir_api_handler";
import {Account} from "../src/interface/interfaces";
import {truncateEntireAccountsTable} from "../src/database/account_service";
import {login, sendRegister} from "../src/test_handler";

/**
 * The tests in this file tests the autorisation of the FHIR server in combination with the generated JWT
 * The tests include Patients or Admins trying to fetch and/or update their information.
 * The tests always expect a valid response
 * 
 * The following tests exists:
 *   Patient should get patient resource with correct API request
 *   Patient shouldn't get patient resource because FHIR_ID isn't correct (Not their patient information
 *   Patient shouldn't get patient resource because token isn't correct
 *   Patient shouldn't get patient resource because token is expired
 *   Patient shouldn't be able to update their own patient resource
 *   Patient shouldn't be able to update another patients' resource
 *   Patient shouldn't be able to create a patient resource
 *   Patient shouldn't be able to delete a patient resource
 *   Patient should get observation resource with correct API request
 *   Patient shouldn't get observation resource because FHIR_ID isn't correct (Not their observation information
 *   Patient shouldn't be able to update his own observation resource
 *   Patient shouldn't be able to update another patients observation resource
 *   Patient shouldn't be able to delete an observation resource
 *   Patient shouldn't be able to create an observation resource
 *   Admin should get patient resource with correct API request
 *   Admin shouldn't get patient resource when token isn't correct
 *   Admin shouldn't get patient resource when token is expired
 *   Admin should be able to update a patient resource with correct FHIR_ID
 *   Admin should be able to create a patient resource
 *   Admin should be able to patch a patient resource
 *   Admin should be able to delete a patient resource
 *   Admin should be able to search for a bundle
 */
describe("FHIR API", function () {
    let patientAccount: Account;
    let anotherPatientAccount: Account;
    let adminAccount: Account;
    
    before(function () {
        initInstance();
        patientAccount = {user:{ email: "Delano@NoToken", fhir_id: "16", password: "TestCase01", role: "patient"}, observation: "18"}
        anotherPatientAccount = {user:{ email: "Another@NoToken", fhir_id: "345", password: "TestCase01", role: "patient"}, observation: "358"}
        adminAccount = {user:{ email: "admin@NoToken", fhir_id: "16", password: "TestCase01", role: "admin"}, observation: "18"}
    });

    describe("Role | Patient", function () {

        before(async function () {
            await truncateEntireAccountsTable();
            await sendRegister(patientAccount.user)
            patientAccount.tokens = (await login(patientAccount.user)).tokens;
        });

        describe("Resource | Patient", function () {
            it("Patient should get patient resource with correct API request", async function () {
               const response = await getResource(patientAccount.user.fhir_id, patientAccount.tokens.token);

                assert.equal(response.statusCode, 200);
                // assert.equal(response.resource.id, patientAccount.user.fhir_id)
            }).timeout(8000);

            it("Patient shouldn't get patient resource because FHIR_ID isn't correct (Not their patient information)",  async function () {
                const response = await getResource(anotherPatientAccount.user.fhir_id, patientAccount.tokens.token);


                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't get patient resource because token isn't correct",  async function () {
                const response = await getResource(anotherPatientAccount.user.fhir_id, (patientAccount.tokens.token + "|||agaga"));

                patientAccount.tokens.token = patientAccount.tokens.token.split("|||")[0]
                assert.equal(response.statusCode, 401);
            });

            // it("Patient shouldn't get patient resource because token is expired",  async function () {
            //     const response = await getPatient(patientAccount.user.fhir_id, patientAccount.tokens.token + "a");
            //
            //
            //
            //     assert.equal(response.statusCode, 403);
            // });

            it("Patient shouldn't be able to update their own patient resource",  async function () {
                const patientResource = JSON.stringify({
                    "resourceType": "Patient",
                    "id": patientAccount.user.fhir_id,
                    "meta": {
                        "versionId": "2",
                        "lastUpdated": "2022-07-13T11:56:07.928+00:00",
                        "source": "#hJRgfp3JGMPbpxta"
                    },
                    "text": {
                        "status": "generated",
                        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 1298409248786398935  Population seed: 1656580069718</div>"
                    },
                    "extension": [{
                        "url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName",
                        "valueString": "Kamala553 Wilkinson796"
                    }, {
                        "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
                        "valueAddress": {"city": "Marum", "state": "Groningen", "country": "NL"}
                    }, {
                        "url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years",
                        "valueDecimal": 3.1504976107473337
                    }, {
                        "url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years",
                        "valueDecimal": 63.84950238925266
                    }],
                    "identifier": [{
                        "system": "https://github.com/synthetichealth/synthea",
                        "value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"
                    }, {
                        "type": {
                            "coding": [{
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "MR",
                                "display": "Medical Record Number"
                            }], "text": "Medical Record Number"
                        },
                        "system": "http://hospital.smarthealthit.org",
                        "value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"
                    }, {
                        "type": {
                            "coding": [{
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "SS",
                                "display": "Social Security Number"
                            }], "text": "Social Security Number"
                        }, "system": "http://hl7.org/fhir/sid/us-ssn", "value": "999-11-5278"
                    }, {
                        "type": {
                            "coding": [{
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "DL",
                                "display": "Driver's License"
                            }], "text": "Driver's License"
                        }, "system": "urn:oid:2.16.840.1.113883.4.3.25", "value": "S99932898"
                    }, {
                        "type": {
                            "coding": [{
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "PPN",
                                "display": "Passport Number"
                            }], "text": "Passport Number"
                        },
                        "system": "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber",
                        "value": "X45002039X"
                    }],
                    "name": [{"use": "official", "family": "Delano", "given": ["Waal", "Gianni"], "prefix": ["Mr."]}],
                    "telecom": [{"system": "phone", "value": "555-923-6761", "use": "home"}],
                    "gender": "male",
                    "birthDate": "1954-05-08",
                    "address": [{
                        "extension": [{
                            "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
                            "extension": [{"url": "latitude", "valueDecimal": 53.1818429321414}, {
                                "url": "longitude",
                                "valueDecimal": 6.553239255206972
                            }]
                        }],
                        "line": ["659 Monahan Viaduct"],
                        "city": "Groningen",
                        "state": "Groningen",
                        "postalCode": "9745",
                        "country": "NL"
                    }],
                    "maritalStatus": {
                        "coding": [{
                            "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                            "code": "M",
                            "display": "M"
                        }], "text": "M"
                    },
                    "multipleBirthBoolean": false,
                    "communication": [{
                        "language": {
                            "coding": [{
                                "system": "urn:ietf:bcp:47",
                                "code": "en-US",
                                "display": "English"
                            }], "text": "English"
                        }
                    }]
                })
                const response = await updateResource(patientAccount.user.fhir_id, patientAccount.tokens.token, patientResource);


                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to update another patients' resource",  async function () {
                const patientResource = JSON.stringify({"resourceType": "Patient","id": anotherPatientAccount.user.fhir_id, "meta": {"versionId": "2","lastUpdated": "2022-07-13T11:56:07.928+00:00","source": "#hJRgfp3JGMPbpxta"},"text": {"status": "generated","div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 1298409248786398935  Population seed: 1656580069718</div>"},"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName","valueString": "Kamala553 Wilkinson796"}, {"url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace","valueAddress": {"city": "Marum","state": "Groningen","country": "NL"}}, {"url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years","valueDecimal": 3.1504976107473337}, {"url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years","valueDecimal": 63.84950238925266} ],"identifier": [ {"system": "https://github.com/synthetichealth/synthea","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR","display": "Medical Record Number"} ],"text": "Medical Record Number"},"system": "http://hospital.smarthealthit.org","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "SS","display": "Social Security Number"} ],"text": "Social Security Number"},"system": "http://hl7.org/fhir/sid/us-ssn","value": "999-11-5278"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "DL","display": "Driver's License"} ],"text": "Driver's License"},"system": "urn:oid:2.16.840.1.113883.4.3.25","value": "S99932898"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "PPN","display": "Passport Number"} ],"text": "Passport Number"},"system": "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber","value": "X45002039X"} ],"name": [ {"use": "official","family": "Delano","given": [ "Waal", "Gianni" ],"prefix": [ "Mr." ]} ],"telecom": [ {"system": "phone","value": "555-923-6761","use": "home"} ],"gender": "male","birthDate": "1954-05-08","address": [ {"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/geolocation","extension": [ {"url": "latitude","valueDecimal": 53.1818429321414}, {"url": "longitude","valueDecimal": 6.553239255206972} ]} ],"line": [ "659 Monahan Viaduct" ],"city": "Groningen","state": "Groningen","postalCode": "9745","country": "NL"} ],"maritalStatus": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus","code": "M","display": "M"} ],"text": "M"},"multipleBirthBoolean": false,"communication": [ {"language": {"coding": [ {"system": "urn:ietf:bcp:47","code": "en-US","display": "English"} ],"text": "English"}} ]})
                const response = await updateResource(anotherPatientAccount.user.fhir_id, patientAccount.tokens.token, patientResource);


                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to create a patient resource",  async function () {
                const patientResource = JSON.stringify({"resourceType": "Patient"})
                const response = await createResource(patientAccount.tokens.token, patientResource);



                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to delete a patient resource",  async function () {
                const response = await deleteResource(patientAccount.user.fhir_id, patientAccount.tokens.token);



                assert.equal(response.statusCode, 403);
            });

            //History?
            //Search?
        });


        describe("Resource | Observation", function () {
            it("Patient should get observation resource with correct API request", async function () {
                const response = await getResource(patientAccount.observation, patientAccount.tokens.token, "Observation");

                assert.equal(response.statusCode, 200);
            });

            it("Patient shouldn't get observation resource because FHIR_ID isn't correct (Not their observation information)", async function () {
                const response = await getResource(anotherPatientAccount.observation, patientAccount.tokens.token, "Observation");

                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to update his own observation resource", async function () {
                const observationResource = JSON.stringify({"resourceType": "Observation","id": patientAccount.observation,"meta": {"versionId": "1","lastUpdated": "2022-07-13T11:38:58.178+00:00","source": "#yAqgILoHlK3Gb83D"},"status": "final","category": [ {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/observation-category","code": "vital-signs","display": "vital-signs"} ]} ],"code": {"coding": [ {"system": "http://loinc.org","code": "8302-2","display": "Body Height"} ],"text": "Body Height"},"subject": {"reference": "Patient/"+patientAccount.user.fhir_id},"encounter": {"reference": "Encounter/29"},"effectiveDateTime": "2017-10-15T03:13:36+00:00","issued": "2017-10-15T03:13:36.633+00:00","valueQuantity": {"value": 49.7,"unit": "cm","system": "http://unitsofmeasure.org","code": "cm"}});
                const response = await updateResource(patientAccount.observation, patientAccount.tokens.token, observationResource, "Observation");



                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to update another patients observation resource", async function () {
                const observationResource = JSON.stringify({"resourceType": "Observation","id": anotherPatientAccount.observation,"meta": {"versionId": "1","lastUpdated": "2022-07-13T11:38:58.178+00:00","source": "#yAqgILoHlK3Gb83D"},"status": "final","category": [ {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/observation-category","code": "vital-signs","display": "vital-signs"} ]} ],"code": {"coding": [ {"system": "http://loinc.org","code": "8302-2","display": "Body Height"} ],"text": "Body Height"},"subject": {"reference": "Patient/"+anotherPatientAccount.user.fhir_id},"encounter": {"reference": "Encounter/29"},"effectiveDateTime": "2017-10-15T03:13:36+00:00","issued": "2017-10-15T03:13:36.633+00:00","valueQuantity": {"value": 49.7,"unit": "cm","system": "http://unitsofmeasure.org","code": "cm"}});
                const response = await updateResource(anotherPatientAccount.observation, patientAccount.tokens.token, observationResource, "Observation");


                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to delete an observation resource", async function () {
                const response = await deleteResource(patientAccount.observation, patientAccount.tokens.token, "Observation");


                assert.equal(response.statusCode, 403);
            });

            it("Patient shouldn't be able to create an observation resource", async function () {
                const observationResource = JSON.stringify({"resourceType": "Observation"});
                const response = await createResource(patientAccount.tokens.token, observationResource, "Observation");


                assert.equal(response.statusCode, 403);
            });
        });
    });

    describe("Role | Admin", function () {
        before(async function () {
            await truncateEntireAccountsTable();
            await sendRegister(adminAccount.user)
            adminAccount.tokens = (await login(adminAccount.user)).tokens;
        });

        describe("Resource | Patient", function () {
            it("Admin should get patient resource with correct API request", async function () {
                const response = await getResource(patientAccount.user.fhir_id, adminAccount.tokens.token);

                assert.equal(response.statusCode, 200);
            });

            it("Admin shouldn't get patient resource when token isn't correct", async function () {
                const response = await getResource(patientAccount.user.fhir_id, (adminAccount.tokens.token + "|||agaga"));
                adminAccount.tokens.token = adminAccount.tokens.token.split("|||")[0]

                assert.equal(response.statusCode, 401);
            });

            // it("Admin shouldn't get patient resource when token is expired", function () {
            //     test
                //
                // assert.equal(403, 403);
            // });

            it("Admin should be able to update a patient resource with correct FHIR_ID", async function () {
                const patientResource = JSON.stringify({"resourceType": "Patient","id": patientAccount.user.fhir_id, "meta": {"versionId": "2","lastUpdated": "2022-07-13T11:56:07.928+00:00","source": "#hJRgfp3JGMPbpxta"},"text": {"status": "generated","div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 1298409248786398935  Population seed: 1656580069718</div>"},"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName","valueString": "Kamala553 Wilkinson796"}, {"url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace","valueAddress": {"city": "Marum","state": "Groningen","country": "NL"}}, {"url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years","valueDecimal": 3.1504976107473337}, {"url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years","valueDecimal": 63.84950238925266} ],"identifier": [ {"system": "https://github.com/synthetichealth/synthea","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR","display": "Medical Record Number"} ],"text": "Medical Record Number"},"system": "http://hospital.smarthealthit.org","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "SS","display": "Social Security Number"} ],"text": "Social Security Number"},"system": "http://hl7.org/fhir/sid/us-ssn","value": "999-11-5278"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "DL","display": "Driver's License"} ],"text": "Driver's License"},"system": "urn:oid:2.16.840.1.113883.4.3.25","value": "S99932898"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "PPN","display": "Passport Number"} ],"text": "Passport Number"},"system": "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber","value": "X45002039X"} ],"name": [ {"use": "official","family": "Delano","given": [ "Waal", "Gianni" ],"prefix": [ "Mr." ]} ],"telecom": [ {"system": "phone","value": "555-923-6761","use": "home"} ],"gender": "male","birthDate": "1954-05-08","address": [ {"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/geolocation","extension": [ {"url": "latitude","valueDecimal": 53.1818429321414}, {"url": "longitude","valueDecimal": 6.553239255206972} ]} ],"line": [ "659 Monahan Viaduct" ],"city": "Groningen","state": "Groningen","postalCode": "9745","country": "NL"} ],"maritalStatus": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus","code": "M","display": "M"} ],"text": "M"},"multipleBirthBoolean": false,"communication": [ {"language": {"coding": [ {"system": "urn:ietf:bcp:47","code": "en-US","display": "English"} ],"text": "English"}} ]})
                const response = await updateResource(patientAccount.user.fhir_id, adminAccount.tokens.token, patientResource);


                assert.equal(response.statusCode, 200);
            });

            it("Admin should be able to create a patient resource", async function () {
                const patientResource = JSON.stringify({"resourceType": "Patient","id": Math.floor(Math.random() * 100000) + 1, "meta": {"versionId": "2","lastUpdated": "2022-07-13T11:56:07.928+00:00","source": "#hJRgfp3JGMPbpxta"},"text": {"status": "generated","div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 1298409248786398935  Population seed: 1656580069718</div>"},"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName","valueString": "Kamala553 Wilkinson796"}, {"url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace","valueAddress": {"city": "Marum","state": "Groningen","country": "NL"}}, {"url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years","valueDecimal": 3.1504976107473337}, {"url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years","valueDecimal": 63.84950238925266} ],"identifier": [ {"system": "https://github.com/synthetichealth/synthea","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "MR","display": "Medical Record Number"} ],"text": "Medical Record Number"},"system": "http://hospital.smarthealthit.org","value": "c46f5afe-0b64-20eb-3976-f6795affb9e1"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "SS","display": "Social Security Number"} ],"text": "Social Security Number"},"system": "http://hl7.org/fhir/sid/us-ssn","value": "999-11-5278"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "DL","display": "Driver's License"} ],"text": "Driver's License"},"system": "urn:oid:2.16.840.1.113883.4.3.25","value": "S99932898"}, {"type": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v2-0203","code": "PPN","display": "Passport Number"} ],"text": "Passport Number"},"system": "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber","value": "X45002039X"} ],"name": [ {"use": "official","family": "Delano","given": [ "Waal", "Gianni" ],"prefix": [ "Mr." ]} ],"telecom": [ {"system": "phone","value": "555-923-6761","use": "home"} ],"gender": "male","birthDate": "1954-05-08","address": [ {"extension": [ {"url": "http://hl7.org/fhir/StructureDefinition/geolocation","extension": [ {"url": "latitude","valueDecimal": 53.1818429321414}, {"url": "longitude","valueDecimal": 6.553239255206972} ]} ],"line": [ "659 Monahan Viaduct" ],"city": "Groningen","state": "Groningen","postalCode": "9745","country": "NL"} ],"maritalStatus": {"coding": [ {"system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus","code": "M","display": "M"} ],"text": "M"},"multipleBirthBoolean": false,"communication": [ {"language": {"coding": [ {"system": "urn:ietf:bcp:47","code": "en-US","display": "English"} ],"text": "English"}} ]})
                const response = await createResource(adminAccount.tokens.token, patientResource);


                assert.equal(response.statusCode, 201);
            });

            // it("Admin should be able to patch a patient resource", async function () {
            //     test
                //
                // assert.equal(403, 403);
            // });

            // it("Admin should be able to delete a patient resource", async function () {
            //     test
            //
            // assert.equal(403, 403);
            // });

            // it("Admin should be able to search for a bundle", async function () {
            //     test
            //
            // assert.equal(403, 403);
            // });
        });
    });
});

