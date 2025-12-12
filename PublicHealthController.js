const EducationRepository = require('../repositories/EducationRepository');
const PublicHealthService = require('../services/PublicHealthService');
const service = new PublicHealthService(new EducationRepository());

module.exports = {
    // ... Keep createAlert, getAlerts, getGuides ...
    createAlert: async (req, res) => {
        try {
            const result = await service.createAlert(req.body, req.user.id);
            res.status(201).json({ success: true, id: result });
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
    getAlerts: async (req, res) => {
        try {
            const result = await service.getAlerts();
            res.json(result);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },
    getGuides: async (req, res) => {
        try {
            const result = await service.getGuides(req.query.lang);
            res.json(result);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    // --- NEW CONTROLLER METHODS ---

    // POST /workshops/create
    createWorkshop: async (req, res) => {
        try {
            const result = await service.proposeWorkshop(req.body, req.user.id);
            res.status(201).json({ success: true, message: "Workshop proposed. Pending approval.", id: result });
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // GET /workshops
    getWorkshops: async (req, res) => {
        try {
            const result = await service.getWorkshops();
            res.json(result);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    // POST /workshops/join
    joinWorkshop: async (req, res) => {
        try {
            const workshopId = req.body.workshop_id;
            await service.joinWorkshop(workshopId, req.user.id);
            res.json({ success: true, message: "Registered successfully" });
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
    getGlobalNews: async (req, res) => {
        try {
            const result = await service.getGlobalHealthNews();
            res.json(result);
        } catch (e) { res.status(502).json({ error: e.message }); }
    }
};