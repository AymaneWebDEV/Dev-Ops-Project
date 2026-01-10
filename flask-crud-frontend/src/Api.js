import axios from "axios";

const API_BASE = "/api"; // Use nginx proxy in container

export const fetchItems = (q) => axios.get(`${API_BASE}/items`, { params: { q } });
export const getItem = (id) => axios.get(`${API_BASE}/items/${id}`);
export const createItem = (data) => axios.post(`${API_BASE}/items`, data);
export const updateItem = (id, data) => axios.put(`${API_BASE}/items/${id}`, data);
export const deleteItem = (id) => axios.delete(`${API_BASE}/items/${id}`);
