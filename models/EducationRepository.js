const db = require('../config/db');

class EducationRepository {

    // Existing Alert methods...
    async createAlert(alert) {
        const sql = 'INSERT INTO public_health_alerts (title, message, severity, published_by) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [alert.title, alert.message, alert.severity, alert.publisher]);
        return result.insertId;
    }

    async getAlerts() {
        const [rows] = await db.execute('SELECT * FROM public_health_alerts ORDER BY created_at DESC');
        return rows;
    }

    async getGuides(lang) {
        const [rows] = await db.execute('SELECT * FROM health_guides WHERE language = ?', [lang]);
        return rows;
    }

    // --- UPDATED WORKSHOP METHODS ---

    // 1. Get only APPROVED workshops
    async getWorkshops() {
        const sql = `
            SELECT id, title, topic, description, mode, date, duration 
            FROM workshops 
            WHERE date > NOW() AND approved = TRUE 
            ORDER BY date ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 2. Create a new Workshop (Proposal)
    async createWorkshop(data) {
        const sql = `
            INSERT INTO workshops (title, topic, description, mode, location, date, duration, created_by, approved) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        // Auto-approve if created by Admin (Role check happens in Service/Controller usually, strictly simplified here)
        const isApproved = false;

        const [result] = await db.execute(sql, [
            data.title, data.topic, data.description, data.mode,
            data.location, data.date, data.duration, data.created_by, isApproved
        ]);
        return result.insertId;
    }

    // 3. Register a user for a workshop
    async registerForWorkshop(workshopId, userId) {
        // Check if already registered
        const [existing] = await db.execute('SELECT * FROM workshop_registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, userId]);
        if (existing.length > 0) throw new Error("User already registered for this workshop");

        const sql = 'INSERT INTO workshop_registrations (workshop_id, user_id) VALUES (?, ?)';
        const [result] = await db.execute(sql, [workshopId, userId]);
        return result.insertId;
    }
}
module.exports = EducationRepository;