exports.isPrivate = (req, res, next) => {
    if (req.session.username) {
        return next();
    } else {
        res.redirect('/login');
    }
};
  
exports.isPublic = (req, res, next) => {
    if (req.session.username) {
        res.redirect('/home');
    } else {
        return next();
    }
};