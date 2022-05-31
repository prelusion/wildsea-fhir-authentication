import express from 'express'
import jwt from 'jsonwebtoken'
//import bcrypt from 'bcrypt'

import {User, Account, JwtUser} from "./interface/interfaces";
import * as MySQLConnector from './database/database_connector';
import {getAccountByEmail, registerAccount, updateTokenByFHIREmail} from "./database/account_service";
import {authenticateToken, generateAccessToken, generateRefreshToken} from "./token_handler";

//Globals
export const app = express()
const port = 3000

//Lets the application use JSON
app.use(express.json())

//Inits the mysql pools for queries to be run.
MySQLConnector.init()


app.post('/register', async (req, res) => {
    let statusCode = 201;
    const user: User = req.body;

    if (user.email == null || user.password == null)
        return res.sendStatus(403);

    if (user.fhir_id === null && user.role === "Patient") {
        return res.sendStatus(404);
    }

    await registerAccount({user, tokens: {rToken: null, token: null}}).then((sCode) => {
        statusCode = sCode;
    });

    return res.sendStatus(statusCode);
});

app.get('/login', async (req, res) => {
    const acc = await getAccountByEmail(req.body.email);

    if (!acc) {
        return res.json({statusCode: 403});
    }

    if (req.body.password !== acc.user.password) {
        return res.json({statusCode: 403, tokens: null});
    }

    //Authenticate user
    const user = {
        email: acc.user.email,
        password: acc.user.password,
        fhir_id: acc.user.fhir_id,
        role: acc.user.role
    };

    const token = generateAccessToken(user);
    const rToken = generateRefreshToken(user);

    const result = await updateTokenByFHIREmail(user.email, token, rToken);

    if (!result) {
        return res.json({statusCode: 500, tokens: null});
    }

    return res.json({statusCode: 200, tokens: {token, rToken}});
});


app.get('/logout', async (req, res) => {
    return res.sendStatus(await updateTokenByFHIREmail(req.body.email, null, null))
})

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

    await jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {

        if (err) return res.json({statusCode: 403});
        const token = generateAccessToken({
            email: acc.user.email,
            password: acc.user.password,
            fhir_id: acc.user.fhir_id,
            role: acc.user.role
        });

        const result = await updateTokenByFHIREmail(acc.user.email, token, rToken);
        if (!result) return res.json({statusCode: 406});

        return res.json({statusCode: 200, tokens: {token, rToken}});
    });
})

app.get('/verifyToken', authenticateToken, (req, res) => {
    if (req.body.user === null || req.body.user === undefined) {
        return res.sendStatus(res.statusCode);
    }
    res.json(req.body.user);
})


export function startExpressServer() {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
