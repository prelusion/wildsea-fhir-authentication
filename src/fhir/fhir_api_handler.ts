import axios from "axios"
import {Account, Tokens} from "../interface/interfaces";
import {FhirResponse, Resource, ResourceError} from "../interface/fhir";
let instance;

export function initInstance() {
    instance = axios.create({
        baseURL: 'http://164.92.149.41:8080/fhir/',
        timeout: 2000,
        responseType: 'json'
    });
}

export async function getResource(id: string, token: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await getResourceRequest(`/${resource}/${id}`);
}

export async function updateResource(id: string, token: string, resourceContent: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await updateResourceRequest(`/${resource}/${id}`, resourceContent)
}

export async function deleteResource(id: string, token: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await deleteResourceRequest(`/${resource}/${id}`)
}

export async function createResource(token: string, resourceContent: string, resource = "Patient"):Promise<FhirResponse> {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await createResourceRequest(`/${resource}`, resourceContent)
}

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
