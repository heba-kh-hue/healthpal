const { Alert, HealthGuide } = require('../models/PublicHealth');
const { Workshop, WorkshopRegistration } = require('../models/Workshop');
const { Op } = require('sequelize');
const axios = require('axios');

class PublicHealthController {

    // Alerts
    static async createAlert(req, res) {
        try {
            const alert = await Alert.create({
                ...req.body,
                published_by: req.user.id
            });
            res.status(201).json({ success: true, alert });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    static async getAlerts(req, res) {
        try {
            const alerts = await Alert.findAll({ order: [['created_at', 'DESC']] });
            res.json(alerts);
        } catch (e) { res.status(500).json({ error: e.message }); }
    }

    // Guides
    static async getGuides(req, res) {
        try {
            const lang = req.query.lang || 'ar';
            const guides = await HealthGuide.findAll({ where: { language: lang } });
            res.json(guides);
        } catch (e) { res.status(500).json({ error: e.message }); }
    }

    // Workshops
    static async getWorkshops(req, res) {
        try {
            // Find workshops in the future that are approved
            const workshops = await Workshop.findAll({
                where: {
                    date: { [Op.gt]: new Date() }, // Date > Now
                    approved: true
                },
                order: [['date', 'ASC']]
            });
            res.json(workshops);
        } catch (e) { res.status(500).json({ error: e.message }); }
    }

    static async createWorkshop(req, res) {
        try {
            const workshop = await Workshop.create({
                ...req.body,
                created_by: req.user.id,
                approved: false // Pending approval
            });
            res.status(201).json({ success: true, workshop });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    static async joinWorkshop(req, res) {
        try {
            const exists = await WorkshopRegistration.findOne({
                where: { workshop_id: req.body.workshop_id, user_id: req.user.id }
            });

            if (exists) return res.status(400).json({ message: "Already registered" });

            await WorkshopRegistration.create({
                workshop_id: req.body.workshop_id,
                user_id: req.user.id
            });
            res.json({ success: true, message: "Registered" });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    // External API (News)
    static async getGlobalNews(req, res) {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=3');
            const news = response.data.map(item => ({
                source: "WHO (External API)",
                title: "Global Health: " + item.title.substring(0, 20),
            }));
            res.json(news);
        } catch (e) { res.status(502).json({ error: "External API Failed" }); }
    }
}

module.exports = PublicHealthController;