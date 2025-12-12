const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Needed for hashing

class AuthService {
    constructor(repo) { this.repo = repo; }

    async login(email, password) {
        const user = await this.repo.findByEmail(email);

        // Check if user exists
        if (!user) throw new Error("Invalid Credentials");

        // SMART CHECK:
        // If password is "123456" (our test users), allow it.
        // If it looks like a hash (starts with $2a$), verify with bcrypt.
        let isValid = false;
        if (user.password_hash === password) {
            isValid = true; // For our test seed users
        } else if (user.password_hash.startsWith('$2')) {
            isValid = await bcrypt.compare(password, user.password_hash); // For new registered users
        }

        if (!isValid) throw new Error("Invalid Credentials");

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, role: user.role };
    }

    // --- NEW: Register with Hashing ---
    async register(data) {
        // Hash the password before saving (Privacy Requirement)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // Call repo to save (You need to add create method to UserRepository)
        return await this.repo.createUser({ ...data, password: hashedPassword });
    }
}
module.exports = AuthService;