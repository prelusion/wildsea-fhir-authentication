import dotenv from  'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
//import bcrypt from 'bcrypt'
dotenv.config();

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
    let statusCode = 201;
    const user: User = req.body;

    if (user.email == null || user.password == null) return res.sendStatus(403);

    if(user.fhir_id === null && user.role === "Patient") {
        return res.sendStatus(404);
    }

    await registerAccount({user, rToken:null, token: null}).then((sCode) => {
        statusCode = sCode;
    });

    console.log(statusCode)
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

function generateAccessToken(user: User, time = "30s") {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: time});
}

function generateRefreshToken(user: User) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.get('/logout', async (req, res) => {
    const result = await updateTokenByFHIREmail(req.body.email, null, null);

    if (!result) return res.sendStatus(500);
    return res.sendStatus(200);
})


app.get('/token', async (req, res) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const rToken = authHeader && authHeader.split(' ')[1]

    console.log(rToken)

    const acc: Account = await getAccountByEmail(req.body.email);
    if (rToken !== acc[0].rToken) return res.sendStatus(403);

    await jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {

        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({email: acc[0].email,
            password: acc[0].password,
            fhir_id: acc[0].fhir_id,
            role: acc[0].role})


        const result = await updateTokenByFHIREmail(acc[0].email, accessToken, rToken);
        if (!result) return res.sendStatus(406);
        
       return res.json({accessToken});
    });
})


app.get('/info', authenticateToken, (req, res) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.json(req.user)
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next();
    })
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;
