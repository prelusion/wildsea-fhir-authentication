"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MySQLConnector = __importStar(require("../src/database/database_connector"));
describe("FHIR API", function () {
    describe("Role | Patient", function () {
        describe("Resource | Patient", function () {
            it("Patient should get patient resource with correct API request", function () {
                console.log(process.env.DB_DATABASE);
                MySQLConnector.init();
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
//# sourceMappingURL=fhir_api.js.map