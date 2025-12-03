import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";
const USER_URL = "http://localhost:8080/api/users";
const ORDIT_URL = "http://localhost:8080/api/orderitems";

export const createOrder = (order) => axios.post(API_URL, order);
export const getAllOrders = () => axios.get(API_URL);
export const updateOrder = (orderId, order) => axios.put(API_URL + '/' + orderId, order);
export const deleteOrder = (orderId) => axios.delete(API_URL + '/' + orderId);
export const getOrderById = (orderId) => axios.get(API_URL + '/' + orderId);

export const getAllUsers = () => axios.get(USER_URL);
export const getAllOrderItems = () => axios.get(ORDIT_URL);