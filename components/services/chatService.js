const User = require('../models/User');

class ChatService {
    async findUser( login ) {
        const user = await User.findOne({ login });
        if (user) {
            return user;
        }
    }

    async getChatData( login ) {
        const user = await User.findOne({ login });
        if (user) {
            return {
                statusCode: 0,
                message: 'AccessToken is valid.',
                content: {
                    userId: user._id,
                    username: user.username,
                    last_name: user.last_name,
                    login: user.login,
                    email: user.email
                },
                access: true
            }
        }
    }
}

module.exports = new ChatService;