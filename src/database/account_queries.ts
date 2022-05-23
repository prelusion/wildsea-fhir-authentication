export const AccountQueries = {
    registerAccount: `
        INSERT INTO accounts (fhir_id, email, password, role, rToken, token)
            values (?, ?, ?, ?, ?, ?)    
    `,

    getAccounts: `
  SELECT
    fhir_id, email, password, role, token, rToken
  FROM accounts;

  `,

    getAccountByFHIRID: `
        SELECT
            fhir_id, email, password, role, token, rToken
        FROM accounts
        WHERE
            fhir_id = ?
    `,

    getAccountByFHIREmail: `
        SELECT
            fhir_id, email, password, role, token, rToken
        FROM accounts
        WHERE
            email = ?
    `,

    updateTokenByFHIREmail: `
        UPDATE accounts
      SET token = ?,
          rToken = ?
      WHERE
        email = ?
      `,
}
