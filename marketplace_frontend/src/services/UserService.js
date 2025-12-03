import axios from "axios";

//En la const se asigna la url del back-end
const REST_API_URL_BASE = "http://localhost:8080/api/users";
const ORDER_URL = "http://localhost:8080/api/orders";
const REVIEWS_URL = "http://localhost:8080/api/reviews";

export const getAllUsers = () => axios.get(REST_API_URL_BASE);
export const deleteUser = (userId) => axios.delete(REST_API_URL_BASE+ '/' + userId);
export const addUser = (user) => axios.post(REST_API_URL_BASE, user);
export const updateUser = (id, user)=> axios.put(REST_API_URL_BASE + '/' + id, user);
export const getUser = (id) => axios.get(REST_API_URL_BASE + '/' + id);

export const List = (id) => axios.get(`${ORDER_URL}/byUser/${id}`);
export const getAllReviews = () => axios.get(REVIEWS_URL);