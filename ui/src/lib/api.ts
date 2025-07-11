import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL + "/api"
    : "http://localhost:3000/api"
  : "/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
