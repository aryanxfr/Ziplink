import api from "./api";

const authService = {
    async register(data) {
        const response = await api.post("/auth/register", data);
        return response.data.data;
    },

    async login(data) {
        const response = await api.post("/auth/login", data);
        return response.data.data;
    },

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get("/users/me");
        return response.data.data;
    },

    async refreshSession() {
        const response = await api.post("/auth/refresh");
        return response.data.data;
    },

    async resendVerification(data) {
        const response = await api.post(
            "/auth/resend-verification",
            data
        );

        return response.data.data;
    },

    async forgotPassword(data) {
        const response = await api.post(
            "/auth/forgot-password",
            data
        );

        return response.data.data;
    },

    async resetPassword(data) {
        const response = await api.post(
            "/auth/reset-password",
            data
        );

        return response.data.data;
    },

    async changePassword(data) {
        const response = await api.patch(
            "/auth/change-password",
            data
        );

        return response.data.data;
    },

    async verifyEmail(token) {
        const response = await api.get(
            `/auth/verify?token=${token}`
        );

        return response.data.data;
    },

    async verifyEmailChange(token) {
        const response = await api.get(
            `/auth/verify-email-change?token=${token}`
        );

        return response.data;
    },
};

export default authService;