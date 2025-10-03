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
function getUser(req) {
    const jwtToken = req.cookies["jwtToken"];
    if (!jwtToken) {
        return null;
    }
    try {
        const decoded = jwt.decode(jwtToken, process.env.TOKEN_SECRET);
        console.log(decoded);
        
        return decoded;
    } catch (err) {
        return null;
    }
}
module.exports = {auth, getUser};