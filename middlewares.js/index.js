const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const { ACCESS_TOKEN_SECRET } = process.env.JWT_SECRET;









exports.verifyAccessToken = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) return res.status(400).json({ status: false, msg: "Token not found" });
  let user;
  try {
    user = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
  }
  catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    user = await User.findById(user.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    req.user = user;
    next();
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}