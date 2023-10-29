require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthService = require('../services/authService');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const accessTokenLifetime = 24 * 3600; // 24 hours in seconds
const refreshTokenLifetime = 30 * 24 * 3600; // 30 days in seconds
const accessTokenExpirationDate = new Date(Date.now() + accessTokenLifetime);
const refreshTokenExpirationDate = new Date(Date.now() + refreshTokenLifetime);

class AuthController {
    // Registration method
    // ===================================================================================
    async registration (req, res) {
        try {
            const { username, last_name, login, password, email, autoLogin } = req.body;
            // // Checking user by login/email
            const isExistsLogin = await AuthService.findUserByLogin(login);
            const isExistsEmail = await AuthService.findUserByEmail(email);

            if (isExistsLogin) {
                return res.status(409).json({
                    statusCode: 1,
                    message: 'A user with this Login already exists',
                    access: false
                });
            }
    
            if (isExistsEmail) {
                return res.status(409).json({
                    statusCode: 1,
                    message: 'A user with this Email already exists',
                    access: false
                });
            }
    
            // Generate Refresh Token based on newly registered user
            const refreshTokenPayload = { sub: login };
            const newRefreshToken = jwt.sign(
                refreshTokenPayload,
                REFRESH_TOKEN_SECRET,
                { expiresIn: refreshTokenLifetime }
            );
    
            // Creating a user with hashed password and Refresh Token
            const passwordHash = await bcrypt.hash(password, 10);

            const userData = {
                username,
                last_name,
                login,
                passwordHash,
                email,
                refreshToken: newRefreshToken
            };

            await AuthService.saveUser(userData);
    
            const response = res.status(201);
    
            if (autoLogin) {
                // Generate Access Token based on newly registered user
                const accessTokenPayload = { sub: login };
                const newAccessToken = jwt.sign(
                    accessTokenPayload,
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: accessTokenLifetime }
                );
    
                // Saving refreshToken on the client via cookies
                return response
                    .cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        maxAge: accessTokenExpirationDate,
                        sameSite: 'None',
                        secure: true
                    })
                    .cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        maxAge: refreshTokenExpirationDate,
                        sameSite: 'None',
                        secure: true
                    })
                    .json({
                        statusCode: 0,
                        message: 'Registration successfully completed',
                        access: true
                    })
            }
            return response
                .json({
                    statusCode: 0,
                    message: 'Registration successfully completed. Welcome to Sign in.',
                    access: false
                })
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({
                statusCode: 1,
                message: 'Internal Server Error',
                access: false
            });
        }
    }

    // Login method
    // ===================================================================================
    async login (req, res) {
        console.log('req.body', req.body)
        try {
            const { login, password, autoLogin } = req.body;
            const user = await AuthService.findUserByLogin(login);
    
            if (!user) {
                return res.status(401).json({
                    statusCode: 1,
                    message: 'This user was not found',
                    access: false
                });
            }
    
            // eslint-disable-next-line
            if (!(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({
                    statusCode: 1,
                    message: 'Incorrect password',
                    access: false
                });
            }
    
            const newAccessToken = jwt.sign(
                { sub: user.login },
                ACCESS_TOKEN_SECRET,
                { expiresIn: accessTokenLifetime }
            );
    
            const newRefreshToken = jwt.sign(
                { sub: user.login },
                REFRESH_TOKEN_SECRET,
                { expiresIn: refreshTokenLifetime }
            );
    
            const response = res.status(201);
    
            if (autoLogin) {
                // Updating Refresh Token in the database
                await AuthService.updateRefreshToken(login, newRefreshToken);
                return response
                    .cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        maxAge: accessTokenExpirationDate,
                        sameSite: 'None',
                        secure: true
                    })
                    .cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        maxAge: refreshTokenExpirationDate,
                        sameSite: 'None',
                        secure: true
                    })
                    .json({
                        statusCode: 0,
                        message: null,
                        access: true
                    })
            } else {
                // Updating Refresh Token in the database
                await AuthService.updateRefreshToken(login, '');
                return response
                    .cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        maxAge: accessTokenExpirationDate,
                        sameSite: 'None',
                        secure: true,
                    })
                    .cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        maxAge: 0,
                        sameSite: 'None',
                        secure: true
                    })
                    .json({
                        statusCode: 0,
                        message: null,
                        access: true
                    })
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                statusCode: 1,
                message: 'Internal Server Error',
                access: false
            });
        }
    }
}

module.exports = new AuthController();