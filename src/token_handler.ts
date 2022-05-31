import {User} from "./interface/interfaces";
import jwt from 'jsonwebtoken'

export function generateAccessToken(user: User, time = "30m") {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);/*{expiresIn: time}*/
}

export function generateRefreshToken(user: User) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

// Middleware function for api requests
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) res.statusCode = 401;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.statusCode = 403;

        req.body.user = user
        next();
    })
}
