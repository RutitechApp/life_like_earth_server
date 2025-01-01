const express = require("express");
const {
  getExoplanetsAction,
  getExoplanetsByPlanetTypeAction,
} = require("../controllers/client/exoplanets.controller");
const {
  getExoplanetsQuizAction,
} = require("../controllers/client/exoplanetsQuiz.controller");
const router = express.Router();

router.get("/exoplanets", getExoplanetsAction);
router.get("/exoplanets-type", getExoplanetsByPlanetTypeAction);
router.get("/exoplanets-quiz/:exoplanetId", getExoplanetsQuizAction);

module.exports = router;
