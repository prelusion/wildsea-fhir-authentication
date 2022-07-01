import {LoginResponse, User} from "./interface/interfaces";
import supertest from "supertest";
import dotenv from  'dotenv'
import path from "path";

// Dotenv must be loaded before app, this way the .env.test will be read before the ..env file when running tests.
dotenv.config({path: path.join(__dirname, "../.env.test")});
import {app} from "./server"
const request = supertest(app);

export async function sendRegister(user: User, expectedStatusCode = 201): Promise<number> {
    let statusCode: number;
    await request.post("/register")
        .send({
            email: user.email,
            fhir_id: user.fhir_id,
            password: user.password,
            role: user.role
        }).expect(expectedStatusCode)
        .then((res) => {
            statusCode = res.statusCode;
        }).catch((err) => {
            statusCode = err.statusCode;
        });
    return statusCode;
}

export async function login(user: User): Promise<LoginResponse> {
    let loginResponse: LoginResponse;
    await request.get("/login")
        .send({
            email: user.email,
            password: user.password,
        })
        .then((res) => {
            loginResponse = res.body;
        }).catch((err) => {
            loginResponse = err.body;
        });
    return loginResponse;
}

export async function logout(user: User, expectedStatusCode = 201): Promise<number> {
    let statusCode: number;
    await request.get("/logout")
        .send({
            email: user.email,
        }).expect(expectedStatusCode)
        .then((res) => {
            statusCode = res.statusCode;
        }).catch((err) => {
            statusCode = err.statusCode;
        });
    return statusCode;
}

export async function verifyToken(token: string): Promise<User | number> {
    let statusCode = 0;
    let user: User;

    await request.get("/verifyToken")
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
            // Checks if the res.body is an empty object. If so return a statusCode;
            if (res.statusCode >= 300) {
                statusCode = res.statusCode;
            }
            user = res.body;
        }).catch((err) => {
            user = null;
        });

    if (statusCode !== 0) {
        return statusCode;
    }
    return user;
}

export async function refreshToken(user: User, refreshToken: string): Promise<LoginResponse> {
    let loginResponse: LoginResponse;

    await request.get("/token")
        .set('Authorization', `Bearer ${refreshToken}`)
        .send({email: user.email})
        .then((res) => {
            loginResponse = res.body
        }).catch((err) => {
            loginResponse = err.body
        });

    return loginResponse;
}
