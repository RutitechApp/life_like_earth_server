const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

// Multer file filter for CSV and Excel validation
const fileFilter = (req, file, cb) => {
  const filetypes = /csv|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "File type not supported! Only CSV and Excel files are allowed."
      )
    );
  }
};

module.exports.exoplanetCsvFunction = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;

      // Check if the app is running on Vercel or locally
      if (process.env.VERCEL) {
        uploadPath = "/tmp"; // Vercel environment
      } else {
        uploadPath = path.join(__dirname, "../public/assets/exoplanetCsv");

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileExtension = file.mimetype.split("/")[1];
      return cb(null, `${uuid()}.${fileExtension}`);
    },
  }),
  limits: { fileSize: 1000000000000000000000000 },
  fileFilter: fileFilter,
}).single("csv");

module.exports.exoplanetImageFunction = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;

      if (process.env.VERCEL) {
        uploadPath = "/tmp";
      } else {
        uploadPath = path.join(__dirname, "../public/assets/exoplanetImages");

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileExtension = file.mimetype.split("/")[1];
      return cb(null, `${uuid()}.${fileExtension}`);
    },
  }),
  limits: { fileSize: 1000000000000000000000000 },
}).single("image");
