import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reviews';
const PROD_URL = 'http://localhost:8080/api/products';
const USER_URL = 'http://localhost:8080/api/users';

export const getAllReviews = () => axios.get(API_URL);
export const getReviewById = (id) => axios.get(API_URL + '/' + id);
export const createReview = (review) => axios.post(API_URL, review);
export const deleteReview = (id) => axios.delete(API_URL + '/' + id);
export const updateReview = (id,review) => axios.put(`${API_URL}/${id}`, review);

export const getAllproducts = () => axios.get(PROD_URL);