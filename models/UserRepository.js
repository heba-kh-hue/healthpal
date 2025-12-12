const db = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // --- NEW ---
    async createUser(user) {
        const sql = 'INSERT INTO users (username, email, password_hash, role, contact_phone) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [user.username, user.email, user.password, user.role, user.phone]);
        return result.insertId;
    }
}
module.exports = UserRepository;