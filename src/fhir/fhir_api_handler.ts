import axios from "axios"
import {Account, Tokens} from "../interface/interfaces";
import {FhirResponse, Resource, ResourceError} from "../interface/fhir";
let instance;

/**
* This function create an AXIOS HTTP instance with the FHIR server of choice
*/
export function initInstance() {
    instance = axios.create({
        baseURL: 'http://fhir.wildezee.com/fhir/',
        timeout: 2000,
        responseType: 'json'
    });
}

/**
* This function creates a GET resource requests and sends it to the next method which will actually send to the FHIR server
* @param {string} id
* @param {string} token
* @param {string} resource (Expects a string of a resource, "Patient" is default)
* @return {FhirResponse}
*/
export async function getResource(id: string, token: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await getResourceRequest(`/${resource}/${id}`);
}

/**
* This function creats a UPDATE resource requests and sends it to the next method which will actually send to the FHIR server
* @param {string} id
* @param {string} token
* @param {string} resourceContent
* @param {string} resource (Expects a string of a resource, "Patient" is default)
* @return {FhirResponse}
*/
export async function updateResource(id: string, token: string, resourceContent: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await updateResourceRequest(`/${resource}/${id}`, resourceContent)
}

/**
* This function creates a DELETE resource requests and sends it to the next method which will actually send to the FHIR server
* @param {string} id
* @param {string} token
* @param {string} resource (Expects a string of a resource, "Patient" is default)
* @return {FhirResponse}
*/
export async function deleteResource(id: string, token: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await deleteResourceRequest(`/${resource}/${id}`)
}


/**
* This function creates a CREATE resource requests and sends it to the next method which will actually send to the FHIR server
* @param {string} token
* @param {string} resourceContent
* @param {string} resource (Expects a string of a resource, "Patient" is default)
* @return {FhirResponse}
*/
export async function createResource(token: string, resourceContent: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await createResourceRequest(`/${resource}`, resourceContent)
}

/**
* This function sends a GET request to the FHIR server expecting a FHIR resource
* @param {string} url
* @return {FhirResponse}
*/
export async function getResourceRequest(url: string) {
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

/**
* This function sends a UPDATE request to the FHIR server
* @param {string} url
* @param {string} data
* @return {FhirResponse}
*/
export async function updateResourceRequest(url: string, data: string) {
    const fhirResponse: FhirResponse = {resource: null, statusCode: 500};
    await instance.put(url, data, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            fhirResponse.statusCode = res.status;
        }).catch(err => {
            fhirResponse.statusCode = err.response.status;
        });

    return fhirResponse;
}

/**
* This function sends a DELETE request to the FHIR server
* @param {string} url
* @return {FhirResponse}
*/
export async function deleteResourceRequest(url: string) {
    const fhirResponse: FhirResponse = {resource: null, statusCode: 500};
    await instance.delete(url)
        .then(res => {
            fhirResponse.statusCode = res.status;
        }).catch(err => {
            fhirResponse.statusCode = err.response.status;
        });

    return fhirResponse;
}

/**
* This function sends a CREATE request to the FHIR server
* @param {string} url
* @param {string} data
* @return {FhirResponse}
*/
export async function createResourceRequest(url: string, data: string) {
    const fhirResponse: FhirResponse = {resource: null, statusCode: 500};
    await instance.post(url, data, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            fhirResponse.statusCode = res.status;
        }).catch(err => {
            fhirResponse.statusCode = err.response.status;
        });

    return fhirResponse;
}
