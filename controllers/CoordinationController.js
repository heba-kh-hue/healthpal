const InventoryRepository = require('../repositories/InventoryRepository');
const CoordinationService = require('../services/CoordinationService');
const service = new CoordinationService(new InventoryRepository());

module.exports = {
    addInventory: async (req, res) => {
        try {
            const result = await service.addInventory(req.body, req.user.id, req.file);
            res.status(201).json({ success: true, id: result });
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
    search: async (req, res) => {
        try {
            const result = await service.search(req.query.city);
            res.json(result);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },
    createRequest: async (req, res) => {
        try {
            const result = await service.requestItem(req.body, req.user.id);
            res.status(201).json({ success: true, id: result });
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
    fulfillRequest: async (req, res) => {
        try {
            await service.fulfill(req.body, req.user.id);
            res.json({ success: true, message: "Request Fulfilled" });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }
};