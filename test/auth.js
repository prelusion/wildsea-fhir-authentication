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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_service_1 = require("../src/database/account_service");
const test_handler_1 = require("../src/test_handler");
const token_handler_1 = require("../src/token_handler");
describe("Token", function () {
    describe("Generation", function () {
        let user;
        let generatedToken;
        let generatedRefreshToken;
        before(function () {
            user = { email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient" };
        });
        beforeEach(function () {
            generatedToken = (0, token_handler_1.generateAccessToken)(user);
            generatedRefreshToken = (0, token_handler_1.generateRefreshToken)(user);
        });
        it("Generating access token should return given value", function () {
            const decodedUser = jsonwebtoken_1.default.decode(generatedToken);
            assert_1.default.equal(decodedUser.email, "Delano@NoToken");
            assert_1.default.equal(decodedUser.fhir_id, "1");
            assert_1.default.equal(decodedUser.role, "Patient");
        });
        it("Generated access token should be verified correctly", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const verifiedUser = yield (0, test_handler_1.verifyToken)(generatedToken);
                assert_1.default.notEqual(verifiedUser, null);
                assert_1.default.equal(verifiedUser.email, "Delano@NoToken");
                assert_1.default.equal(verifiedUser.fhir_id, "1");
                assert_1.default.equal(verifiedUser.role, "Patient");
            });
        });
        it("Generated access token that has been manipulated should return 403", function () {
            return __awaiter(this, void 0, void 0, function* () {
                generatedToken += "a";
                const verifiedUser = yield (0, test_handler_1.verifyToken)(generatedToken);
                assert_1.default.equal(verifiedUser, 403);
            });
        });
    });
    describe("Generation of RefreshToken", function () {
        let user;
        let rToken;
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, account_service_1.truncateEntireAccountsTable)();
                user = { email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient" };
                yield (0, test_handler_1.sendRegister)(user);
            });
        });
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function* () {
                user.email = "Delano@NoToken";
                rToken = (yield (0, test_handler_1.login)(user)).tokens.rToken;
            });
        });
        it("Generating refresh token should return given value", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const loginResponse = yield (0, test_handler_1.refreshToken)(user, rToken);
                console.log(loginResponse.tokens.token);
                const decodedUser = jsonwebtoken_1.default.decode(loginResponse.tokens.token);
                assert_1.default.equal(loginResponse.statusCode, 200);
                assert_1.default.equal(decodedUser.email, "Delano@NoToken");
                assert_1.default.equal(decodedUser.fhir_id, "1");
                assert_1.default.equal(decodedUser.role, "Patient");
            });
        });
        it("Should return status code 403 because of a wrong email", function () {
            return __awaiter(this, void 0, void 0, function* () {
                user.email = "Delano@wrongemail";
                const loginResponse = yield (0, test_handler_1.refreshToken)(user, rToken);
                assert_1.default.equal(loginResponse.statusCode, 403);
            });
        });
        it("Should return status code 403 because the rToken has been manipulated", function () {
            return __awaiter(this, void 0, void 0, function* () {
                rToken += "a";
                const loginResponse = yield (0, test_handler_1.refreshToken)(user, rToken);
                assert_1.default.equal(loginResponse.statusCode, 403);
            });
        });
    });
});
//# sourceMappingURL=auth.js.map