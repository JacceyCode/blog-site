const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (req, res, next) => {
  const Authourization = req.headers.Authorization || req.headers.authorization;

  if (Authourization && Authourization.startsWith("Bearer")) {
    const token = Authourization.split(" ")[1];

    //verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token", 403));
      }

      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("Unauthorized. No token found.", 402));
  }
};

module.exports = authMiddleware;
