module.exports.checkAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/dashboard");
  }
  return next();
};

module.exports.checkAdminLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    return res.redirect("/admin/login");
  }
};
