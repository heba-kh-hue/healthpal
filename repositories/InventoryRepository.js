const db = require('../config/db');

class InventoryRepository {
    async addItem(item) {
        const sql = `INSERT INTO inventory_registry (name, type, quantity_available, total_quantity, storage_location, source_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [item.name, item.type, item.quantity, item.quantity, item.location, item.source_id, item.image_url]);
        return result.insertId;
    }

    async searchItems(city) {
        let sql = 'SELECT * FROM inventory_registry WHERE quantity_available > 0';
        const params = [];
        if (city) {
            sql += ' AND storage_location LIKE ?';
            params.push(`%${city}%`);
        }
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    async createRequest(reqData) {
        const sql = `INSERT INTO medicine_requests (patient_id, item_name_requested, quantity_needed, delivery_location) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [reqData.patient_id, reqData.item_name, reqData.quantity, reqData.location]);
        return result.insertId;
    }

    async fulfillTransaction(requestId, inventoryId, fulfillerId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [req] = await connection.execute('SELECT quantity_needed FROM medicine_requests WHERE request_id = ? FOR UPDATE', [requestId]);
            const [inv] = await connection.execute('SELECT quantity_available FROM inventory_registry WHERE item_id = ? FOR UPDATE', [inventoryId]);

            if (req.length === 0 || inv.length === 0) throw new Error("Item or Request not found");
            if (inv[0].quantity_available < req[0].quantity_needed) throw new Error("Not enough stock");

            await connection.execute('UPDATE medicine_requests SET status = "fulfilled", fulfilled_by = ?, fulfilled_date = NOW() WHERE request_id = ?', [fulfillerId, requestId]);
            await connection.execute('UPDATE inventory_registry SET quantity_available = quantity_available - ? WHERE item_id = ?', [req[0].quantity_needed, inventoryId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
module.exports = InventoryRepository;