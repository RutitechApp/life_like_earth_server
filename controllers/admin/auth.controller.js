const ExoplanetModel = require("../../models/exoplanet.model");
const ExoplanetQuizModel = require("../../models/exoplanets-quiz.model");

exports.adminLoginRenderAction = async (req, res) => {
  try {
    return res.render("Login", {
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.adminLoginPassAction = async (req, res) => {
  try {
    return res.redirect("dashboard");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.adminLogoutAction = async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        } else {
          return res.redirect("login");
        }
      });
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.dashboardAction = async (req, res) => {
  try {
    const exoplanetData = await ExoplanetModel.find({ isDeleted: false });
    const exoplanetQuizData = await ExoplanetQuizModel.find({
      isDeleted: false,
    });

    return res.render("Dashboard", {
      exoplanetData: exoplanetData,
      exoplanetQuizData: exoplanetQuizData,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.clearCacheAction = async (req, res) => {
  try {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    return res.redirect("/admin/dashboard");
  } catch (error) {
    return res.redirect("back");
  }
};
