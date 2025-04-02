import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAxios = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [navigate]);

  return axiosInstance;
};

export default useAxios;
