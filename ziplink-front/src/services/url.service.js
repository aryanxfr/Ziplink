import api from "./api"

const urlService= {
    async createUrl(data){
        const response=await api.post("/urls",data);
        return response.data.data;
    },

    async deleteUrl(id){
        const response= await api.delete(`/urls/${id}`);
        return response.data.data;
    },

    async activateUrl(id) {
        const response = await api.patch(`/urls/${id}/activate`);
        return response.data.data;
    },

    async deactivateUrl(id) {
        const response = await api.patch(`/urls/${id}/deactivate`);
        return response.data.data;
    },

    async getUrlById(id) {
        const response = await api.get(`/urls/${id}`);
        return response.data.data;
    },

    async updateUrl(id, data) {
        const response = await api.patch(`/urls/${id}`, data);
        return response.data.data;
    },

};

export default urlService;