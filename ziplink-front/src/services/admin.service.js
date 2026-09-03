import api from "./api";

const adminService = {
    async getMessages(params = {}) {
        const response = await api.get("/admin/messages", { params });
        return response.data.data;
    },

    async updateMessageStatus(id, status) {
        const response = await api.patch(`/admin/messages/${id}/status`, { status });
        return response.data.data;
    },

    async deleteMessage(id) {
        const response = await api.delete(`/admin/messages/${id}`);
        return response.data;
    },

    async getNewMessageCount() {
        const response = await api.get("/admin/messages/count");
        return response.data.data;
    },
};

export default adminService;
