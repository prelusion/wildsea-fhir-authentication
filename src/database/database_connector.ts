import { createPool, Pool} from 'mysql2';
import process from "process";

let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
    if (process.env.DB_HOST === undefined || process.env.DB_HOST === null) {
        process.env.DB_CONNECTION_LIMIT = "4";
        process.env.DB_HOST = "mysql"
        process.env.DB_USER = "admin"
        process.env.DB_PASSWORD = "admin"
        process.env.DB_DATABASE = "fhir-authentication-test"
        process.env.DB_PORT = "3306"
    }
    console.log("Host: " + process.env.DB_HOST);
    try {
        pool = createPool({
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: parseInt(process.env.DB_PORT)
        });
        console.log(`The following database is used: ${process.env.DB_DATABASE}`)
        console.debug('MySql Adapter Pool generated successfully');
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
};

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const execute = <T>(query: string, params: string[] | object): Promise<T> => {
    if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
    try {
        return new Promise<T>((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore test
                    resolve(results);
                }
            });
        });

    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}
