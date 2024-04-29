const jwt = require("jsonwebtoken");
// const { ACCESS_TOKEN_SECRET } = process.env.JWT_SECRET;

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = {
  createAccessToken,
}