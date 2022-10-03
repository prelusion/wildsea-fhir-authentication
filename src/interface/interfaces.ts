export interface User {
    fhir_id?: string;
    email: string;
    password?: string;
    role: string;
}

export interface JwtUser extends User {
    iat: number;
    exp: number;
}

export interface Tokens {
    token?: string;
    rToken?: string;
}

export interface Account {
    user: User;
    tokens?: Tokens;
    observation?: string;
}

export interface LoginResponse {
    statusCode: number;
    tokens?: Tokens;
}
