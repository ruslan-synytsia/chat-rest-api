const User = require('../models/User');

class AuthService {
    async findUserByEmail ( email ) {
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return existingUserByEmail;
        }
    }

    async findUserByLogin ( login ) {
        const existingUserByLogin = await User.findOne({ login });
        if (existingUserByLogin) {
            return existingUserByLogin;
        }
    }

    async saveUser ( userData ) {
        const {username, last_name, login, passwordHash, email, refreshToken} = userData;
        const user = new User({
            username,
            last_name,
            login,
            passwordHash,
            email,
            refreshToken
        });
        await user.save();
    }

    async updateRefreshToken (login, refreshToken) {
        await User.findOneAndUpdate({ login: login }, { $set: { refreshToken: refreshToken } });
    }
}

module.exports = new AuthService;