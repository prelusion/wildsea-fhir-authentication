import { execute } from "../database/database_connector";
import { AccountQueries } from "./account_queries";
import {Account} from "../interfaces";

export const registerAccount = async (acc: Account) => {
    let responseCode = 201;
    await execute<{ affectedRows: number }>(AccountQueries.registerAccount, [
        acc.user.fhir_id,
        acc.user.email,
        acc.user.password,
        acc.user.role,
        acc.rToken,
        acc.token,
    ]).catch((error) => {
        console.log(error)
        responseCode = 409;
    });

    return responseCode
};

export const getAllAccounts = async () => {
    let responseCode = 202;
    await execute<{ affectedRows: number }>(AccountQueries.getAccounts, [
    ]).catch((error) => {
        console.log(error)
        responseCode = 409;
    });

    return responseCode
};


export const getAccountByFHIRID = async (acc: Account): Promise<Account> => {
    let account = null;
    account = await execute<{ affectedRows: number }>(AccountQueries.getAccountByFHIRID, [
        acc.user.fhir_id
    ]).catch((error) => {
        console.log(error)
        account = 409;
    });

    return account
};

export const getAccountByEmail = async (email: string): Promise<Account> => {
    console.log(1)
    let account = null;
    console.log(2)
    account = await execute<{ affectedRows: number }>(AccountQueries.getAccountByFHIREmail, [
        email
    ]).catch((error) => {
        console.log(3)
        console.log(error)
        account = 409;
    });
    console.log(4)

    return account
};

export const updateTokenByFHIREmail = async (email: string, token: string, rToken) => {
    let account = null;
    account = await execute<{ affectedRows: number }>(AccountQueries.updateTokenByFHIREmail, [
        token,
        rToken,
        email
    ]).catch((error) => {
        console.log(error)
        account = 409;
    });

    return account
};
