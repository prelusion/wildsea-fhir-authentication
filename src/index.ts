import env from './environment'

import express from 'express'
import jwt from 'jsonwebtoken'
//import bcrypt from 'bcrypt'
import {User, Account} from "./Interfaces";
import * as MySQLConnector from './database/database_connector';
import {getAccountByEmail, registerAccount, updateTokenByFHIREmail} from "./database/account_service";

//Globals
const app = express()
const port = 3000

//Lets the application use JSON
app.use(express.json())

//Inits the mysql pools for queries to be run.
MySQLConnector.init()

//Expects a type User to be given.
app.post('/register', async (req, res) => {
    let statusCode = 200;
    const user: User = req.body;

    if (user.email == null || user.password == null) return res.sendStatus(403);

    if(user.fhir_id !== null) {
        //If fhir_id is
    }

    await registerAccount({user, rToken:null, token: null}).then((sCode) => {
        statusCode = sCode;
    });
    return res.sendStatus(statusCode);
});

app.get('/login', async (req, res) => {
    const acc: Account = await getAccountByEmail(req.body.email);
    if (req.body.password !== acc[0].password) return res.sendStatus(403);

    //Authenticate user
    const user = { email: acc[0].email,
                    password: acc[0].password,
                    fhir_id: acc[0].fhir_id,
                    role: acc[0].role
                };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const result = await updateTokenByFHIREmail(user.email, accessToken, refreshToken);
    console.log(result);

    if (!result) return res.sendStatus(500);

    res.json({accessToken, refreshToken});
});

function generateAccessToken(user: User, time = "30m") {
    return jwt.sign(user, env.ACCESS_TOKEN_SECRET, {expiresIn: time});
}

function generateRefreshToken(user: User) {
    return jwt.sign(user, env.REFRESH_TOKEN_SECRET);
}

app.get('/logout', async (req, res) => {
    const result = await updateTokenByFHIREmail(req.body.email, null, null);

    if (!result) return res.sendStatus(500);
    return res.sendStatus(200);
})











app.get('/user', authenticateToken, (req, res) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.json(req.user)
})

app.get('/token', (req, res) => {
    const refreshToken = req.body.token;
    //Is this token valid or does it exists in the DB?
    //If so verfiy

    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        // const accessToken = generateAccessToken({name: user.name, password: user.password, fhir_: user.fhir_auth})

        // res.json(accessToken)
    })

})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next();
    })
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
