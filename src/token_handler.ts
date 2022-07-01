import {User} from "./interface/interfaces";
import jwt, {SignOptions} from 'jsonwebtoken'
import fs from "fs";

const privateKEY = fs.readFileSync('./fhir_secret_key', 'utf8');
const privateRKEY = fs.readFileSync('./fhir_secret_key', 'utf8');

function getSignOptions(): SignOptions {
    return {
        issuer: "Wild Sea",
        expiresIn: "12h",
        algorithm: "RS256"
    }
}

export function generateAccessToken(user: User) {
    console.log(privateKEY)
    console.log(privateKEY)
    return jwt.sign(user, privateKEY, getSignOptions());
}

export function generateRefreshToken(user: User) {
    return jwt.sign(user, privateRKEY, getSignOptions());
}

// Middleware function for api requests
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) res.statusCode = 401;

    jwt.verify(token, privateKEY, getSignOptions(),(err, user) => {
        if (err) res.statusCode = 403;

        req.body.user = user
        next();
    })
}
