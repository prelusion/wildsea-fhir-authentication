"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fhir_api_handler_1 = require("../src/fhir/fhir_api_handler");
const account_service_1 = require("../src/database/account_service");
const test_handler_1 = require("../src/test_handler");
describe("FHIR API", function () {
    before(function () {
        (0, fhir_api_handler_1.initInstance)();
    });
    describe("Role | Patient", function () {
        let patientAccount;
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, account_service_1.truncateEntireAccountsTable)();
                patientAccount = { user: { email: "Delano@NoToken", fhir_id: "52", password: "TestCase01", role: "patient" } };
                yield (0, test_handler_1.sendRegister)(patientAccount.user);
                patientAccount.tokens = (yield (0, test_handler_1.login)(patientAccount.user)).tokens;
            });
        });
        describe("Resource | Patient", function () {
            it("Patient should get patient resource with correct API request", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield (0, fhir_api_handler_1.getPatient)(patientAccount);
                    assert_1.default.equal(response.statusCode, 200);
                    assert_1.default.equal(response.resource.id, patientAccount.user.fhir_id);
                });
            }).timeout(8000);
            // it("Patient shouldn't get patient resource because FHIR_ID isn't correct (Not their patient information)", function () {
            //     //test
            //
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't get patient resource because token isn't correct", function () {
            //     //test
            //
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't get patient resource because token is expired", function () {
            //     //test
            //
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't be able to update their own patient resource", function () {
            //     //test
            //
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't be able to update another patients' resource", function () {
            //     //test
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't be able to create a patient resource", function () {
            //     //test
            //
            //     assert.equal(403, 403);
            // });
            //
            // it("Patient shouldn't be able to delete a patient resource", function () {
            //     //test
            //
            //     assert.equal(403, 403);
            // });
            //History?
            //Search?
        });
        describe("Resource | Observation", function () {
            // it("Patient should get observation resource with correct API request", async function () {
            //     const response = await getObservation(patientAccount);
            //
            //     assert.equal(response.statusCode, 200);
            // });
            //
            //     it("Patient shouldn't get observation resource because FHIR_ID isn't correct (Not their observation information)", function () {
            //         //test
            //
            //         assert.equal(403, 403);
            //     });
            //
            //     it("Patient shouldn't be able to update his own observation resource", function () {
            //         //test
            //
            //         assert.equal(403, 403);
            //     });
            //
            //     it("Patient shouldn't be able to update another patients observation resource", function () {
            //         //test
            //
            //         assert.equal(403, 403);
            //     });
            //
            //     it("Patient shouldn't be able to create an observation resource", function () {
            //         //test
            //
            //         assert.equal(403, 403);
            //     });
        });
    });
    // describe("Role | Admin", function () {
    //     describe("Resource | Patient", function () {
    //         it("Admin should get patient resource with correct API request", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //
    //         it("Admin shouldn't get patient resource when token isn't correct", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //
    //         it("Admin shouldn't get patient resource when token is expired", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //
    //         it("Admin should be able to update a patient resource with correct FHIR_ID", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //
    //         it("Admin should be able to create a patient resource", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //
    //         it("Admin should be able to create a patient resource", function () {
    //             //test
    //
    //             assert.equal(403, 403);
    //         });
    //     });
    // });
    //
    // describe("Role | WildSea", function () {
    //     describe("Resource | Patient", function () {
    //         it("", function () {
    //             //test
    //         });
    //     });
    // });
});
//# sourceMappingURL=fhir_api.js.map