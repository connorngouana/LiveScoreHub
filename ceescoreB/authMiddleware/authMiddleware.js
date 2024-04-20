import jwt from "jsonwebtoken";
import CollectionUser from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log("No JWT token found in the request headers or cookies.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "your-secret-key");

    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    // Check if decoded token contains userId
    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    // Fetch user from database using userId
    const user = await CollectionUser.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user object to the request for further usage
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
