const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
  if (!token || !secret) {
    return false;
  }

  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

function validateTokens(accessToken, refreshToken, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET) {
  const accessCheckResult = verifyToken(accessToken, ACCESS_TOKEN_SECRET);
  const refreshCheckResult = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
  return { accessCheckResult, refreshCheckResult };
}

module.exports = validateTokens;
