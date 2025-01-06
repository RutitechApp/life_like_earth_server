const express = require("express");
const {
  getExoplanetsAction,
  getExoplanetsByPlanetTypeAction,
} = require("../controllers/client/exoplanets.controller");
const {
  getExoplanetsQuizAction,
} = require("../controllers/client/exoplanetsQuiz.controller");
const { userRegisterAction, userLoginAction, getLoginUserAction, forgetPasswordAction, verifyForgotPasswordOtpAction, resetPasswordAction, resendOtpAction, userLogoutAction } = require("../controllers/client/user.controller");
const userAuth = require("../middleware/check.user.auth");
const { submitQuizAction, getUserQuizResults } = require("../controllers/client/exoplanetsQuizResult.controller");
const router = express.Router();

// Exoplanets
router.get("/exoplanets", getExoplanetsAction);
router.get("/exoplanets-type", getExoplanetsByPlanetTypeAction);
router.get("/exoplanets-quiz/:exoplanetId", getExoplanetsQuizAction);

// Users
router.post("/user/register", userRegisterAction)
router.post("/user/login", userLoginAction)
router.get("/user/info", userAuth, getLoginUserAction)
router.post("/user/forget-password", forgetPasswordAction);
router.post("/user/verify-otp", verifyForgotPasswordOtpAction);
router.post("/user/reset-password", resetPasswordAction);
router.post("/user/resend-otp", resendOtpAction);
router.get("/user/logout", userAuth, userLogoutAction)

// Exoplanets Quiz Results
router.post("/user/quiz-submit", userAuth, submitQuizAction)
router.get("/user/get-quiz-submitted", userAuth, getUserQuizResults)

module.exports = router;
