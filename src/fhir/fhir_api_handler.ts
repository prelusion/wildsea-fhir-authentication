import axios from "axios"
import {Account} from "../interface/interfaces";
import {FhirResponse, Resource, ResourceError} from "../interface/fhir";
let instance;

export function initInstance() {
    instance = axios.create({
        baseURL: 'http://localhost:8080/fhir/',
        timeout: 2000,
        headers: {'Authorization': 'Bearer '},
        responseType: 'json'
    });
}

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = "TOKEN";


export async function getPatient(acc: Account):Promise<FhirResponse> {
    const fhirResponse: FhirResponse = {resource: null, statusCode: 500};
    
    instance.defaults.headers.common['Authorization'] = acc.tokens.token;
    instance.get(`/Patient/${acc.user.fhir_id && acc.user.fhir_id}`)
        .then(res => {
            let resource: Resource;
            resource.resourceType = res.resourceType;
            resource.id = res.id;
            
            fhirResponse.resource = resource
            fhirResponse.statusCode = res.statusCode;
        }).catch(err => {
            let resourceError: ResourceError;
            resourceError.resourceType = err.resourceType;
            resourceError.issue = err.issue;
    
            fhirResponse.statusCode = err.statusCode;
    });
    
    return fhirResponse;
}

