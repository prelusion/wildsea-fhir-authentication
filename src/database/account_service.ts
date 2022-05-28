import { execute } from "../database/database_connector";
import { AccountQueries } from "./account_queries";
import {Account} from "../interfaces";

/**
 * executes register query in the MySQL DB
 *
 * @param {Account} acc - provide an entire account as Param
 */
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
        logError(error)
        responseCode = 409;
    });

    return responseCode
};

export const getAllAccounts = async (): Promise<number> => {
    const accounts = await execute<{ affectedRows: number }>(AccountQueries.getAccounts, [
    ]).catch((error) => {
        logError(error)
        return null;
    });

    return accounts
};

export const getAccountByFHIRID = async (acc: Account): Promise<Account> => {
    const account = await execute<{ affectedRows: number }>(AccountQueries.getAccountByFHIRID, [
        acc.user.fhir_id
    ]).catch((error) => {
        logError(error)
        return null
    });

    return account
};

export const getAccountByEmail = async (email: string): Promise<Account> => {
    const account = await execute<{ affectedRows: number }>(AccountQueries.getAccountByFHIREmail, [
        email
    ]).catch((error) => {
        logError(error)
        return null
    });

    return account
};

export const updateTokenByFHIREmail = async (email: string, token: string, rToken): Promise<Account> => {
    const account = await execute<{ affectedRows: number }>(AccountQueries.updateTokenByFHIREmail, [
        token,
        rToken,
        email
    ]).catch((error) => {
        logError(error)
        return null
    });

    return account
};

export const truncateEntireAccountsTable = async () => {
    let responseCode = 201;
    await execute<{ affectedRows: number }>(AccountQueries.truncateEntireAccountsTable, []).catch((error) => {
        logError(error)
        responseCode = 409;
    });

    return responseCode
};


function logError(error: string) { console.log('\n\x1b[36m%s\x1b[0m', "    DB Error logged at: " + Date.now() + "\n       " + error )}
