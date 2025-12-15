const jwt = require("jsonwebtoken");

const SECRET = "mySecretKey12345";

function requireLogin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: Please login",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // lưu user info cho các route sau
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token expired or invalid",
    });
  }
}

module.exports = requireLogin;
