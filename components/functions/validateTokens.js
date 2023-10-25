const jwt = require('jsonwebtoken');

async function validateTokens(accessToken, refreshToken, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET) {
  // Checking Access Token
  const accessCheckResult = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err) => !err);
  // Checking Refresh Token
  const refreshCheckResult = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err) => !err);
  return { accessCheckResult, refreshCheckResult };
}

module.exports = validateTokens;