import api from "./api"

const userService = {
    async getCurrentUser() {
        const response = await api.get("/users/me");
        return response.data.data;
    },

    async requestEmailChange(data) {
        const response = await api.post("/users/me/change-email", data);
        return response.data;
    },

    async deleteAccount(data) {
        const response = await api.delete("/users/me", { data });
        return response.data.data;
    },
};

export default userService;