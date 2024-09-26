require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const PORT = process.env.PORT || 8078;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: "2048mb" }));
app.use(
  cors({
    credentials: true,
    origin: ["*"],
  })
);
app.use(cookieParser());
app.use(flash());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {  
  res.send("Hello habiTribe :)");
});
app.use("/", require("./routes/index"));

db.on("error", console.error.bind(console, "Connection error of DB :- "));
db.once("open", (error) => {
  if (error) throw Error();
  console.log("Connection is established with DB...!");
  app.listen(PORT, () =>
    console.log(`habiTribe app listening on port http://localhost:${PORT}`)
  );
});
