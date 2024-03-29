import axios from "axios";

export const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL
})