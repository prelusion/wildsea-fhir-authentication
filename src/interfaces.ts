export interface User {
    fhir_id?: string;
    email: string;
    password: string;
    role: string;
}

export interface Account {
    user: User;
    token?: string;
    rToken?: string;
}
