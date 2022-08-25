import {User} from "./interface/interfaces";
import jwt, {SignOptions} from 'jsonwebtoken'
import fs from "fs";

// These are secretkeys used for generating or verifying the Json Web Tokens
const privateKEY = fs.readFileSync('./fhir_secret_key', 'utf8');
const privateRKEY = fs.readFileSync('./fhir_secret_key', 'utf8');

/**
* These are sign options signing the JWT
* @return {SignOptions}
*/
function getSignOptions(): SignOptions {
    return {
        issuer: "Wild Sea",
        expiresIn: "12h",
        algorithm: "RS256"
    }
}
/** This function generates JWT on a specific user
* @param {User} user
* @return a signed JWT
*/
 export function generateAccessToken(user: User) {
    return jwt.sign(user, privateKEY, getSignOptions());
}

/** This function generates refresh JWT on a specific user
* @param {User} user
* @return a signed JWT
*/
export function generateRefreshToken(user: User) {
    return jwt.sign(user, privateRKEY, getSignOptions());
}

// Middleware function for api requests
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) res.statusCode = 401;
    // Todo sign options
    // jwt.verify(token, privateKEY, getSignOptions(),(err, user) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jwt.verify(token, privateKEY, {issuer: "Wild Sea", algorithm: ["RS256"]}, (err, user) => {
        if (err) res.statusCode = 403;

        req.body.user = user
        next();
    })
}
