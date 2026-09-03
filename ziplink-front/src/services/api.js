import axios from "axios";
import { triggerLogout } from "./authManager";
import { forbiddenHandler,
        authErrorHandler,
        notFoundHandler,
        validationHandler,
        serverErrorHandler,
        rateLimitHandler,
} from "./errorHandlers";

const resolveBaseUrl = (url = "") => {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
};

const api = axios.create({
  baseURL: resolveBaseUrl(import.meta.env.VITE_API_BASE_URL),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 10000,
});



let isRefreshing = false;
let failedQueue =[];

const processQueue=(error=null) =>{
  failedQueue.forEach(({resolve, reject})=>{
    if(error){
      reject(error);
    }else{
      resolve()
    }
  });
  failedQueue=[];
};

api.interceptors.request.use(
  (config)=> config,
  (error)=>Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status=error.response?.status;

    if(status===401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ){
      originalRequest._retry =true;

      if(isRefreshing){
        return new Promise((resolve,reject)=>{
          failedQueue.push({resolve,reject});
        }).then(()=> api(originalRequest));
      }
      isRefreshing=true;

      try{
        await api.post("/auth/refresh");

        processQueue();
        return api(originalRequest);
      } catch (refreshError){
        processQueue(refreshError);
        error=refreshError;
      } finally{
        isRefreshing = false;
      }
    }

    switch (error.response?.status) {
      case 401:
        triggerLogout();
        break;

      case 403:
        forbiddenHandler();
        break;

      case 404:
        notFoundHandler();
        break;

      case 422:
        validationHandler();
        break;

      case 429:
        rateLimitHandler();
        break;

      case 500:
        serverErrorHandler();
        break;

      default:
         break;
         
    }
    return Promise.reject(error);
  }
);

export default api;