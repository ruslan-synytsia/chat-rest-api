const User = require('../models/User');

class UsersService {
    async findUsers() {
        const users = await User.find();
        if (users) {
            return users;
        }
    }
}

module.exports = new UsersService;