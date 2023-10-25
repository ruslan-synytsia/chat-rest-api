require('dotenv').config();
const jwt = require('jsonwebtoken');
const validateTokens = require('../functions/validateTokens');
const ChatService = require('../services/chatService');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const accessTokenLifetime = 24 * 3600; // 24 hours in seconds
const accessTokenExpirationDate = new Date(Date.now() + accessTokenLifetime);

class ChatController {
    async getChatData (req, res) {
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
        } = await validateTokens(accessToken, refreshToken, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET);
      
        if (accessCheckResult) {
          const accessTokenPayload = jwt.decode(accessToken);
          const login = accessTokenPayload.sub;
          const response = await ChatService.getChatData(login);
          return res.status(200).json(response);
        }
      
        if (refreshCheckResult) {
          const refreshTokenPayload = jwt.decode(refreshToken);
          if (refreshTokenPayload) {
            const login = refreshTokenPayload.sub;
            // Checking for user presence in the database
            const user = await ChatService.findUser(login);
            if (user) {
              if (user.refreshToken && user.refreshToken === refreshToken) {
                // Generate a new Access Token based on Refresh Token sub data
                const newAccessToken = jwt.sign(
                  { sub: login },
                  ACCESS_TOKEN_SECRET,
                  { expiresIn: accessTokenLifetime }
                );
                return res
                  .cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    maxAge: accessTokenExpirationDate,
                    sameSite: 'None',
                    secure: true
                  })
                  .status(200).json({
                    statusCode: 0,
                    message: 'Access token refreshed.',
                    content: {
                      username: user.username,
                      last_name: user.last_name,
                      login: user.login,
                      email: user.email
                    },
                    access: true
                  });
              } else {
                return res.status(200).json({
                  statusCode: 1,
                  message: 'RefreshToken is missing or invalid.',
                  access: false
                });
              }
            }
          } else {
            return res.status(200).json({
              statusCode: 1,
              message: 'A user with this login was not found in the database.',
              access: false
            });
          }
          // If unable to retrieve data from refreshToken, return error
          return res.status(200).json({
            statusCode: 1,
            message: 'Unable to extract data from refreshToken.',
            access: false
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

module.exports = new ChatController();