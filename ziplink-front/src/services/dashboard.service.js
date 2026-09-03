import api from "./api"

const dashboardService={
    async getDashboardData(){
        const response=await api.get("/dashboard");
        return response.data.data
    },

    async getUrls(params={}){
        const response =await api.get("/dashboard/urls",{params,});
        return response.data.data;
    },

    async getRecentUrls(limit = 10) {
        const response = await api.get("/dashboard/recent", {
            params: { limit },
        });

        return response.data.data;
    },
    async getTopUrls(params = {}) {
        const response = await api.get("/dashboard/top", {
            params,
        });

        return response.data.data;
    },

    async getExpiringSoon(days = 7) {
        const response = await api.get("/dashboard/expiring", {
            params: { days },
        });

        return response.data.data;
    },

    async getUrlAnalytics(id) {
        const response = await api.get(`/dashboard/urls/${id}/analytics`);

        return response.data.data;
    },
};

export default dashboardService;