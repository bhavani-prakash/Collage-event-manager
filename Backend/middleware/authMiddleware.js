function isAdmin(req, res, next) {
    // Always allow access for now
    next();
}

module.exports = isAdmin;