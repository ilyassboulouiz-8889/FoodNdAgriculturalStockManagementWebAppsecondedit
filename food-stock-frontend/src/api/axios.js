import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ Always attach token for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("foodstock_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: helpful logging while debugging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API ERROR >>>", {
      url: err?.config?.url,
      method: err?.config?.method,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return Promise.reject(err);
  }
);

export default api;
