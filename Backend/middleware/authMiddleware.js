function isAdmin(req, res, next) {
    // Use JWT-based authentication and check for admin role
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
    const authHeader = req.headers['authorization'];
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') {
            req.user = decoded;
            return next();
        } else {
            return res.status(403).json({ message: 'Admins only.' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
}

module.exports = isAdmin;