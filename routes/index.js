const express = require("express");
const router = express.Router();

router.use("/admin", require("./server.routes.js"));
router.use("/api", require("./client.routes.js"));

module.exports = router;
