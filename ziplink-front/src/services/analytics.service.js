import api from "./api"

const analyticsService = {
    /**
     * GET /urls/summary
     * Returns aggregate stats: totalUrls, totalClicks, activeUrls, expiredUrls
     */
    async getSummary() {
        const response = await api.get("/urls/summary");
        return response.data.data;
    },

    /**
     * GET /dashboard/top?page=0&size=10
     * Returns top URLs sorted by click count
     */
    async getTopUrls(params = {}) {
        const response = await api.get("/dashboard/top", { params });
        return response.data.data;
    },

    /**
     * GET /dashboard/urls/{id}/analytics
     * Returns detailed analytics for a single URL
     */
    async getUrlAnalytics(urlId) {
        const response = await api.get(`/dashboard/urls/${urlId}/analytics`);
        return response.data.data;
    },

    /**
     * GET /urls/{id}/clicks?page=0&size=20
     * Returns paginated click event history for a URL
     */
    async getClickHistory(urlId, params = {}) {
        const response = await api.get(`/urls/${urlId}/clicks`, { params });
        return response.data.data;
    },

    async getDeviceBreakdown(urlId) {
        const response = await api.get(`/dashboard/urls/${urlId}/analytics/devices`);
        return response.data.data;
    },

    async getBrowserBreakdown(urlId) {
        const response = await api.get(`/dashboard/urls/${urlId}/analytics/browsers`);
        return response.data.data;
    },

    async getReferrerBreakdown(urlId) {
        const response = await api.get(`/dashboard/urls/${urlId}/analytics/referrers`);
        return response.data.data;
    },
};

export default analyticsService;