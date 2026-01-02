require('dotenv').config();
const validateTokens = require('../functions/validateTokens');
const UsersService = require('../services/usersService');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

class UsersController {
    async getUsersList (req, res) {
        const cookieString = req.headers.cookie;
        const cookies = cookieString ? cookieString.split('; ') : [];
      
        let accessToken = null, refreshToken = null;
      
        for (const cookie of cookies) {
          const [name, value] = cookie.split('=');
          if (name === 'accessToken') {
            accessToken = value;
          } else if (name === 'refreshToken') {
            refreshToken = value;
          }
        }
      
        const { 
          accessCheckResult, 
          refreshCheckResult 
        } = await validateTokens(accessToken, null, ACCESS_TOKEN_SECRET, null);
      
        if (accessCheckResult) {
          const list = await UsersService.findUsers();
          const usersList = list.map(user => {
            return {
              _id: user._id,
              username: user.username,
              last_name: user.last_name,
              login: user.login
            }
          });

          return res.status(200).json({
            statusCode: 0,
            message: 'Users list',
            usersList,
            access: true
          });
        }

        // Returning an error if neither the Access Token nor the Refresh Token is valid
        return res.status(200).json({
          statusCode: 1,
          message: 'Access/Refresh token is obsolete.',
          access: false
        });
    }
}

module.exports = new UsersController();
