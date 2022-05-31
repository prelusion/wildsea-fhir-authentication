import dotenv from  'dotenv'
dotenv.config();

import * as MySQLConnector from './database/database_connector';
import * as server from "./server";
import {generateAccessToken} from "./token_handler";

//Inits the mysql pools for queries to be run.
MySQLConnector.init()

server.startExpressServer()
console.log(generateAccessToken({email: "delanovdwaal@hotmail.com", fhir_id: "3", password: "Welcome01", role: "patient"}))


