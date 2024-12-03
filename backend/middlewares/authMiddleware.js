const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({ err: "Unauthorized Please Login First" });
  } else {
    try {
      const decodedToken = await jwt.verify(
        accessToken,
        process.env.SECRET_KEY
      );
      req.role = decodedToken.role;
      req.id = decodedToken.id;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Please Login Here" });
    }
  }
};
