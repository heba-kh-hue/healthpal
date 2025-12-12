const axios = require('axios');
class PublicHealthService {
    constructor(repo) { this.repo = repo; }

    async createAlert(data, userId) {
        return await this.repo.createAlert({ ...data, publisher: userId });
    }
    async getAlerts() { return await this.repo.getAlerts(); }
    async getGuides(lang) { return await this.repo.getGuides(lang || 'ar'); }

    // --- WORKSHOPS ---
    async getWorkshops() {
        return await this.repo.getWorkshops();
    }

    async proposeWorkshop(data, userId) {
        // Business Logic: Validate Date
        if (new Date(data.date) <= new Date()) {
            throw new Error("Workshop date must be in the future.");
        }
        return await this.repo.createWorkshop({ ...data, created_by: userId });
    }

    async joinWorkshop(workshopId, userId) {
        if (!workshopId) throw new Error("Workshop ID is required");
        return await this.repo.registerForWorkshop(workshopId, userId);
    }

    async getGlobalHealthNews() {
        try {
            // We are calling an external API here.
            // In a real app, this would be the WHO (World Health Organization) RSS feed.
            // We use jsonplaceholder to simulate external data reliability.
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=3');

            // We transform the external data to fit our app
            return response.data.map(item => ({
                source: "WHO (External API)",
                title: "Global Health Update: " + item.title.substring(0, 20) + "...",
                link: "https://www.who.int/news"
            }));
        } catch (error) {
            console.error("External API Failed", error);
            throw new Error("Failed to fetch external news");
        }
    }
}
module.exports = PublicHealthService;