import axios from "axios";

const API_URL = "http://localhost:8080/api/orderItems";
const PROD_URL = "http://localhost:8080/api/products";
const ORD_URL = "http://localhost:8080/api/orders";

export const createOrderItem = (orderItem) => axios.post(API_URL, orderItem);
export const getAllOrderItems = () => axios.get(API_URL);
export const updateOrderItem = (orderItemId, orderItem) => axios.put(API_URL + '/' + orderItemId, orderItem);
export const deleteOrderItem = (orderItemId) => axios.delete(API_URL + '/' + orderItemId);
export const getOrderItemById = (orderItemId) => axios.get(API_URL + '/' + orderItemId);

export const getAllProducts = () => axios.get(PROD_URL);
export const getAllOrders = () => axios.get(ORD_URL);