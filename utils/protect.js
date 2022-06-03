module.exports = (req, res, next) => {
	if (!req.session.isLoggedIn) return res.redirect('/admin/login');

	res.locals.loggedInAs = req.session.firstName;
	next();
};
