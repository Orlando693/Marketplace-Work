import axios from "axios";

const API_URL="http://localhost:8080/api/stores";

export const getStores=()=> axios.get(API_URL);
export const getStoreById=(id)=> axios.get(`${API_URL}/${id}`);
export const RegisterNewStore=(store) => axios.post(API_URL,store);
export const DeleteStore=(id) => axios.delete(`${API_URL}/${id}`);
export const UpdateStore=(id,store) => axios.put(`${API_URL}/${id}`,store);
