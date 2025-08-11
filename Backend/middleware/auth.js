module.exports.ensureAuthenticated = (req, res, next) => {   
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ success: false, message: 'User not authenticated' });
}

module.exports.ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ success: false, message: 'Access denied' });
}