import { createPool, Pool} from 'mysql2';
import DB from '../environment'

let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
    try {
        pool = createPool({
            connectionLimit: DB.DB_CONNECTION_LIMIT,
            host: DB.DB_HOST,
            user: DB.DB_USER,
            password: DB.DB_PASSWORD,
            database: DB.DB_DATABASE,
        });

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
    try {
        if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
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
