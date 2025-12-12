const InventoryItem = require('../models/InventoryItem');
const MedicineRequest = require('../models/Medicine');
const sequelize = require('../config/database');
const { Op } = require('sequelize'); // For search operators like LIKE

class CoordinationController {

    // Feature 3: Add Inventory
    static async addInventory(req, res) {
        try {
            const newItem = await InventoryItem.create({
                name: req.body.name,
                type: req.body.type,
                quantity_available: req.body.quantity,
                storage_location: req.body.location,
                source_id: req.user.id, // From Partner's Auth Middleware
                image_url: req.file ? req.file.filename : null
            });
            res.status(201).json({ success: true, item: newItem });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    // Feature 3: Search
    static async search(req, res) {
        try {
            const { city, name } = req.query;
            const whereClause = { quantity_available: { [Op.gt]: 0 } }; // quantity > 0

            if (city) whereClause.storage_location = { [Op.like]: `%${city}%` };
            if (name) whereClause.name = { [Op.like]: `%${name}%` };

            const items = await InventoryItem.findAll({ where: whereClause });
            res.json(items);
        } catch (e) { res.status(500).json({ error: e.message }); }
    }

    // Feature 3: Create Request
    static async createRequest(req, res) {
        try {
            const request = await MedicineRequest.create({
                patient_id: req.user.id,
                item_name_requested: req.body.item_name,
                quantity_needed: req.body.quantity,
                delivery_location: req.body.location
            });
            res.status(201).json({ success: true, request });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    // Feature 3: Fulfill Request (Transaction)
    static async fulfillRequest(req, res) {
        const t = await sequelize.transaction(); // Start Transaction
        try {
            const { request_id, inventory_id } = req.body;

            // 1. Find Items
            const request = await MedicineRequest.findByPk(request_id, { transaction: t });
            const item = await InventoryItem.findByPk(inventory_id, { transaction: t });

            if (!request || !item) throw new Error("Item or Request not found");
            if (item.quantity_available < request.quantity_needed) throw new Error("Not enough stock");

            // 2. Update Data
            await request.update({
                status: 'fulfilled',
                fulfilled_by: req.user.id,
                fulfilled_date: new Date()
            }, { transaction: t });

            await item.decrement('quantity_available', {
                by: request.quantity_needed,
                transaction: t
            });

            await t.commit(); // Save changes
            res.json({ success: true, message: "Request Fulfilled" });
        } catch (e) {
            await t.rollback(); // Undo changes if error
            res.status(400).json({ error: e.message });
        }
    }
}

module.exports = CoordinationController;