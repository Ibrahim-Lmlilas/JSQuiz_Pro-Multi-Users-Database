const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const jwtToken = req.cookies["jwtToken"];
    if (!jwtToken) {
        return res.status(401).json({ message: "Not Autherized" });
    }
    jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Not Authorized" });
        }
        next();
    });
}

module.exports = auth;