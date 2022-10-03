import dotenv from 'dotenv'
dotenv.config();
import * as server from "./server";
import {generateAccessToken} from "./token_handler";

/**
* Start the express server
*/
server.startExpressServer()
console.log(generateAccessToken({email: "delanovdwaal@hotmail.com", fhir_id: "28", role: "patient"}));




