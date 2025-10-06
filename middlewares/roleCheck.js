const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if user is an admin (role_id = 2)
async function requireAdmin(req, res, next) {
    try {
        const jwtToken = req.cookies["jwtToken"];
        
        if (!jwtToken) {
            return res.status(401).send("Not Authorized - Please login");
        }

        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
        
        // Get user from database with their role
        const user = await User.findOne({ where: { id: decoded.id } });
        
        if (!user) {
            return res.status(401).send("User not found");
        }

        // Check if user is admin (role_id = 2)
        if (user.role_id !== 2) {
            return res.status(403).send("Access Denied - Admin privileges required");
        }

        // Attach user to request for later use
        req.user = user;
        next();
    } catch (err) {
        console.log("Admin check error:", err.message);
        return res.status(401).send("Invalid token");
    }
}

// Middleware to check if user is a regular user (role_id = 1)
async function requireUser(req, res, next) {
    try {
        const jwtToken = req.cookies["jwtToken"];
        
        if (!jwtToken) {
            return res.status(401).send("Not Authorized - Please login");
        }

        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
        
        // Get user from database with their role
        const user = await User.findOne({ where: { id: decoded.id } });
        
        if (!user) {
            return res.status(401).send("User not found");
        }

        // Check if user is regular user (role_id = 1)
        if (user.role_id !== 1) {
            return res.status(403).send("Access Denied - User privileges required");
        }

        // Attach user to request for later use
        req.user = user;
        next();
    } catch (err) {
        console.log("User check error:", err.message);
        return res.status(401).send("Invalid token");
    }
}

// Export middleware functions
module.exports = {
    requireAdmin,
    requireUser
};
