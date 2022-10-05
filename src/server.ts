import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from "fs";
import bcrypt from "bcrypt";

import {User} from "./interface/interfaces";
import * as MySQLConnector from './database/database_connector';
import {getAccountByEmail, registerAccount, updateTokenByFHIREmail} from "./database/account_service";
import {authenticateToken, generateAccessToken, generateRefreshToken} from "./token_handler";

// Globals defined
// app is the express server
export const app = express()
// Port for the express server
const port = 3000

const privateRKEY = fs.readFileSync('./fhir_secret_key', 'utf8');
// Lets the application use JSON
app.use(express.json())
app.use(cors());

// Inits the mysql pools for queries to be run.
MySQLConnector.init()

/**
* Register HTTP API listener
* Registers a USER into the DB
* @return {number}
*/
app.post('/register', async (req, res) => {
    console.log("register DETECTED");

    let statusCode = 201;
    const user: User = req.body;

    if (user.email == null || user.password == null)
        return res.sendStatus(403);

    if (user.fhir_id === null && user.role.toLowerCase() === "patient") {
        return res.sendStatus(404);
    }

    user.password = bcrypt.hashSync(user.password, 10);

    await registerAccount({user, tokens: {rToken: null, token: null}}).then((sCode) => {
        statusCode = sCode;
    });

    return res.sendStatus(statusCode);
});


const pubKey = fs.readFileSync('./fhir_public_key', 'utf8');

/**
* Login HTTP API listener
* Logs a user in
* @param req
* @param res
* @return {number | User object}
*/
app.post('/login', async (req, res) => {
    console.log("LOGIN DETECTED");
    
    const acc = await getAccountByEmail(req.body.email);

    if (!acc) {
        return res.json({statusCode: 403});
    }

    if (!bcrypt.compareSync(req.body.password, acc.user.password)) {
        return res.json({statusCode: 403, tokens: null});
    }

    // Authenticate user
    const user = {
        email: acc.user.email,
        fhir_id: acc.user.fhir_id,
        role: acc.user.role
    };

    const token = generateAccessToken(user);
    const rToken = generateRefreshToken(user);

    const result = await updateTokenByFHIREmail(user.email, token, rToken);

    if (!result) {
        return res.json({statusCode: 500, tokens: null});
    }

    return res.json({statusCode: 200, tokens: {token, rToken}, key: pubKey});
});



/**
* Logout HTTP API listener, Logs a USER out
* @param req
* @param res
* @return {number}
*/
app.get('/logout', async (req, res) => {
    return res.sendStatus(await updateTokenByFHIREmail(req.body.email, null, null))
})


/**
* Logout HTTP API listener, Logs a USER out
* @param req
* @param res
* @return {number}
*/
app.get('/token', async (req, res) => {
    const authHeader = req.headers['authorization']
    const rToken = authHeader && authHeader.split(' ')[1]

    const acc = await getAccountByEmail(req.body.email);
    if (!acc) {
        return res.json({statusCode: 403});
    }

    if (rToken !== acc.tokens.rToken) {
        return res.json({statusCode: 403});
    }

    await jwt.verify(rToken, privateRKEY, async (err, user) => {

        if (err) return res.json({statusCode: 403});
        const token = generateAccessToken({
            email: acc.user.email,
            fhir_id: acc.user.fhir_id,
            role: acc.user.role
        });

        const result = await updateTokenByFHIREmail(acc.user.email, token, rToken);
        if (!result) return res.json({statusCode: 406});

        return res.json({statusCode: 200, tokens: {token, rToken}});
    });
})

/**
* Verifytoken HTTP API listener, Verifies a token of a user.
* @param req
* @param res
* @return {User}
*/
app.get('/verifyToken', authenticateToken, (req, res) => {

    if (req.body.user === null || req.body.user === undefined) {
        return res.sendStatus(res.statusCode);
    }
    res.json(req.body.user);
})



/**
* Starts the Express server on port ${port}
*/
export function startExpressServer() {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
