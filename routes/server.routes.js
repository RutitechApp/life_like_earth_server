const router = require("express").Router();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const {
  checkAdmin,
  checkAdminLogin,
} = require("../middleware/check.admin.auth");
const {
  adminLoginRenderAction,
  adminLoginPassAction,
  adminLogoutAction,
  dashboardAction,
  clearCacheAction,
} = require("../controllers/admin/auth.controller");
const {
  exoplanetManageRenderAction,
  addExoplanetManageRenderAction,
  addExoplanetAction,
  deleteExoplanetAction,
  addCsvExoplanetManageRenderAction,
  addCsvExoplanetAction,
  editCsvExoplanetManageRenderAction,
  editExoplanetImageAction,
} = require("../controllers/admin/exoplanets.controller");
const {
  exoplanetQuizManageRenderAction,
  addExoplanetQuizManageRenderAction,
  addExoplanetQuizAction,
  editExoplanetManageRenderAction,
  editExoplanetQuizAction,
  deleteExoplanetQuizAction,
} = require("../controllers/admin/exoplanetsQuiz.controller");
const {
  exoplanetCsvFunction,
  exoplanetImageFunction,
} = require("../middleware/imageUpload");
require("../middleware/local.strategy");

router.use(
  session({
    name: "admin",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY_ADMIN,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      secure: false, // Set to true if you're using HTTPS
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get("/login", checkAdmin, adminLoginRenderAction);
router.post(
  "/login-data",
  passport.authenticate("local", { failureRedirect: "/admin/login" }),
  adminLoginPassAction
);
router.get("/logout", adminLogoutAction);
router.get("/dashboard", checkAdminLogin, dashboardAction);
router.get("/clear-cache", clearCacheAction);

// exoplanet
router.get("/exoplanets", checkAdminLogin, exoplanetManageRenderAction);
router.post("/add-exoplanet", checkAdminLogin, addExoplanetAction);
router.get("/delete-exoplanet/:id", checkAdminLogin, deleteExoplanetAction);
router.get(
  "/add-exoplanet-render",
  checkAdminLogin,
  addExoplanetManageRenderAction
);
router.get(
  "/exoplanets-csv",
  checkAdminLogin,
  addCsvExoplanetManageRenderAction
);
router.post("/add-exoplanet-csv", exoplanetCsvFunction, addCsvExoplanetAction);
router.get("/edit-exoplanets/:id", editCsvExoplanetManageRenderAction);
router.post(
  "/edit-exoplanets-action/:id",
  exoplanetImageFunction,
  editExoplanetImageAction
);

// exoplanet quiz
router.get(
  "/exoplanets-quiz",
  checkAdminLogin,
  exoplanetQuizManageRenderAction
);
router.get(
  "/add-exoplanets-quiz",
  checkAdminLogin,
  addExoplanetQuizManageRenderAction
);
router.post(
  "/add-exoplanets-quiz-action",
  checkAdminLogin,
  addExoplanetQuizAction
);
router.get(
  "/edit-exoplanets-quiz/:id",
  checkAdminLogin,
  editExoplanetManageRenderAction
);
router.post(
  "/edit-exoplanets-quiz-action/:id",
  checkAdminLogin,
  editExoplanetQuizAction
);
router.get(
  "/delete-exoplanets-quiz/:id",
  checkAdminLogin,
  deleteExoplanetQuizAction
);

module.exports = router;
