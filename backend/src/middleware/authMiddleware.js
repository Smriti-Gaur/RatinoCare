import jwt from "jsonwebtoken";
import config from "../config/env.js";

const protect = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No Token",
      });
    }

    // Extract the token after "Bearer "
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }

    const decoded = jwt.verify(
      token,
      config.JWT_SECRET
    );

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.user = {
      id: decoded.id.toString(),
      role: decoded.role,
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }
};

export default protect;