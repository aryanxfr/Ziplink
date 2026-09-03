import { triggerLogout } from "./authManager";

export const authErrorHandler = () =>{
    triggerLogout();
}
export const forbiddenHandler = () =>{
    console.warn("Forbidden");
}

export const notFoundHandler = () => {
  console.warn("Resource not found");
};

export const validationHandler = () => {
  console.warn("Validation error");
};

export const rateLimitHandler = () => {
  console.warn("Too many requests");
};

export const serverErrorHandler = () => {
  console.warn("Internal server error");
};