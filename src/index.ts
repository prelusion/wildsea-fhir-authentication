import dotenv from 'dotenv'
dotenv.config();
import * as server from "./server";
import {generateAccessToken} from "./token_handler";

server.startExpressServer()
console.log(generateAccessToken({email: "delanovdwaal@hotmail.com", fhir_id: "28", password: "Welcome01", role: "patient"}));




