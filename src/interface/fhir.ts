export interface Resource {
    resourceType: string;
    id: string;
    // meta: object;
    // identifier: object[];
    // active: boolean,
    // name: object[];
    // telecom: object[];
    // gender: string;
    // birthDate: string;
}

export interface ResourceError {
    resourceType: string;
    issue: Issue;
}

export interface Issue {
    severity: string;
    code: string;
    diagnostics: string
}

export interface FhirResponse {
    resource?: Resource | ResourceError;
    statusCode: number
}
