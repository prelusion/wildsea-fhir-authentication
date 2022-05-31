import dotenv from  'dotenv'
import path from "path";
import * as MySQLConnector from "../src/database/database_connector";
import {startExpressServer} from "../src/server";

dotenv.config({path: path.join(__dirname, "../.env.test")});

//Inits the mysql pools for queries to be run.
MySQLConnector.init()

startExpressServer()
