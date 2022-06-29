import { execute } from "../database/database_connector";
import { AccountQueries } from "./account_queries";
import {Account} from "../interface/interfaces";

/**
 * executes register query in the MySQL DB
 *
 * @param {Account} acc - provide an entire account as Param
 */
export const registerAccount = async (acc: Account) => {
    let statusCode = 201;
    await execute<{ affectedRows: number }>(AccountQueries.registerAccount, [
        acc.user.fhir_id || null,
        acc.user.email,
        acc.user.password,
        acc.user.role,
        acc.tokens.rToken,
        acc.tokens.token,
    ]).catch((error) => {
        logError(error)
        statusCode = 409;
    });

    return statusCode
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

export const getAccountByEmail = async (email: string): Promise<Account | null> => {
    const accounts = await execute<{ affectedRows: number }>(AccountQueries.getAccountByFHIREmail, [
        email
    ]).catch((error) => {
        logError(error)
        return null
    });
    if(accounts.length === 0) {
        return null;
    }
    const account = accounts[0];
    return {tokens: {token: account.token, rToken: account.rToken}, user: {fhir_id: account.fhir_id, email: account.email, password: account.password, role: account.role}}
};

export const updateTokenByFHIREmail = async(email: string, token: string, rToken): Promise<number> => {
    const accounts = await execute<{ affectedRows: number }>(AccountQueries.updateTokenByFHIREmail, [
        token,
        rToken,
        email
    ]).catch((error) => {
        logError(error)
        return null
    });

    if (accounts.affectedRows === 0) return 404
    return 200
};

export const truncateEntireAccountsTable = async () => {
    let statusCode = 201;
    await execute<{ affectedRows: number }>(AccountQueries.truncateEntireAccountsTable, []).catch((error) => {
        logError(error)
        statusCode = 409;
    });

    return statusCode
};


function logError(error: string) { console.log('\n\x1b[36m%s\x1b[0m', "    DB Error logged at: " + Date.now() + "\n       " + error )}
