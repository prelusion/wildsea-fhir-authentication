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
describe("Database authentication system ", function () {
    let statusCode;
    describe("Register", function () {
        let registerUser;
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, account_service_1.truncateEntireAccountsTable)();
                registerUser = { email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient" };
            });
        });
        beforeEach(function () {
            //Increments the fhir_id because it's unique in the DB
            registerUser.fhir_id = (parseInt(registerUser.fhir_id) + 1).toString();
            statusCode = null;
        });
        it("should return status code 201 for creating the Patient", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, test_handler_1.sendRegister)(registerUser, 201).then(code => {
                    statusCode = code;
                });
                assert_1.default.equal(statusCode, 201);
            });
        });
        it("should return status code 409 because the email is not unique", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, test_handler_1.sendRegister)(registerUser, 409).then(code => {
                    statusCode = code;
                });
                assert_1.default.equal(statusCode, 409);
            });
        });
        it("should return status code 409 because the fhir_id is not unique", function () {
            return __awaiter(this, void 0, void 0, function* () {
                registerUser.fhir_id = "2";
                registerUser.email = "temp@temp";
                yield (0, test_handler_1.sendRegister)(registerUser, 409).then(code => {
                    statusCode = code;
                });
                assert_1.default.equal(statusCode, 409);
            });
        });
        it("should return status code 403 because the email is empty", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tempEmail = registerUser.email;
                registerUser.email = null;
                yield (0, test_handler_1.sendRegister)(registerUser, 403).then(code => {
                    statusCode = code;
                });
                registerUser.email = tempEmail;
                assert_1.default.equal(statusCode, 403);
            });
        });
        it("should return status code 404 if new user is a Patient with no fhir_id", function () {
            return __awaiter(this, void 0, void 0, function* () {
                registerUser.fhir_id = null;
                yield (0, test_handler_1.sendRegister)(registerUser, 404).then(code => {
                    statusCode = code;
                });
                assert_1.default.equal(statusCode, 404);
            });
        });
    });
    describe("login", function () {
        let loginUser;
        const loggedInUserData = {
            tokens: { token: null, rToken: null },
            user: { email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient" }
        };
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, account_service_1.truncateEntireAccountsTable)();
                yield (0, test_handler_1.sendRegister)(loggedInUserData.user);
            });
        });
        beforeEach(function () {
            /* Deep copy of loggedInUserData */
            loginUser = JSON.parse(JSON.stringify(loggedInUserData));
        });
        it("Should return correct token after correct login", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tokens = (yield (0, test_handler_1.login)(loginUser.user)).tokens;
                const user = jsonwebtoken_1.default.decode(tokens.token);
                assert_1.default.equal(user.email, "Delano@NoToken");
                assert_1.default.equal(user.password, "TestCase01");
                assert_1.default.equal(user.role, "Patient");
            });
        });
        it("Should return correct RefreshToken after correct login", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const tokens = (yield (0, test_handler_1.login)(loginUser.user)).tokens;
                const user = jsonwebtoken_1.default.decode(tokens.rToken);
                assert_1.default.equal(user.email, "Delano@NoToken");
                assert_1.default.equal(user.password, "TestCase01");
                assert_1.default.equal(user.role, "Patient");
            });
        });
        it("should return status code 403 because the email is null", function () {
            return __awaiter(this, void 0, void 0, function* () {
                loginUser.user.email = null;
                const statusCode = (yield (0, test_handler_1.login)(loginUser.user)).statusCode;
                assert_1.default.equal(statusCode, 403);
            });
        });
        it("should return status code 403 because the email is not correct", function () {
            return __awaiter(this, void 0, void 0, function* () {
                loginUser.user.email = "ungabunga@uchaucha";
                const statusCode = (yield (0, test_handler_1.login)(loginUser.user)).statusCode;
                assert_1.default.equal(statusCode, 403);
            });
        });
        it("should return status code 403 because the password is incorrect", function () {
            return __awaiter(this, void 0, void 0, function* () {
                loginUser.user.password = "NotWelcome01";
                const statusCode = (yield (0, test_handler_1.login)(loginUser.user)).statusCode;
                assert_1.default.equal(statusCode, 403);
            });
        });
    });
    describe("logout", function () {
        let logoutUser;
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, account_service_1.truncateEntireAccountsTable)();
                logoutUser = { user: { email: "Delano@NoToken", fhir_id: "1", password: "TestCase01", role: "Patient" } };
                yield (0, test_handler_1.sendRegister)(logoutUser.user);
                logoutUser.tokens = (yield (0, test_handler_1.login)(logoutUser.user)).tokens;
                statusCode = null;
            });
        });
        it("should return status code 200 because the logout was successful", function () {
            return __awaiter(this, void 0, void 0, function* () {
                statusCode = yield (0, test_handler_1.logout)(logoutUser.user, 200);
                assert_1.default.equal(statusCode, 200);
            });
        });
        it("should return status code 404 because the given email is incorrect", function () {
            return __awaiter(this, void 0, void 0, function* () {
                logoutUser.user.email = "incorrectEmail";
                statusCode = yield (0, test_handler_1.logout)(logoutUser.user, 404);
                assert_1.default.equal(statusCode, 404);
            });
        });
    });
});
//# sourceMappingURL=database.js.map