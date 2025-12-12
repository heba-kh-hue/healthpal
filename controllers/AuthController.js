const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');
const service = new AuthService(new UserRepository());

module.exports = {
    login: async (req, res) => {
        try {
            const result = await service.login(req.body.email, req.body.password);
            res.json(result);
        } catch (e) { res.status(401).json({ error: e.message }); }
    },
    register: async (req, res) => {
        try {
            const result = await service.register(req.body);
            res.status(201).json({ success: true, userId: result, message: "User registered securely" });
        } catch (e) { res.status(400).json({ error: e.message }); }
    }
};