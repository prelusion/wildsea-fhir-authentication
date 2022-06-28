import axios from "axios"
import {Account} from "../interface/interfaces";
import {FhirResponse, Resource, ResourceError} from "../interface/fhir";
let instance;

export function initInstance() {
    instance = axios.create({
        baseURL: 'http://localhost:8080/fhir/',
        timeout: 2000,
        responseType: 'json'
    });
}

export async function getPatient(acc: Account):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = acc.tokens.token;
    return await getResource(`/Patient/${acc.user.fhir_id && acc.user.fhir_id}`)
}

export async function getObservation(acc: Account):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = acc.tokens.token;
    return await getResource(`/Observation/52`)
}

export async function getResource(url: string) {
    const fhirResponse: FhirResponse = {resource: null, statusCode: 500};
    await instance.get(url)
        .then(res => {
            fhirResponse.resource =  res.data;
            fhirResponse.statusCode = res.status;
        }).catch(err => {
            fhirResponse.resource = err.response.data;
            fhirResponse.statusCode = err.response.status;
        });

    return fhirResponse;
}
