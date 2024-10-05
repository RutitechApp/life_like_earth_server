const fs = require("fs");
const path = require("path");
const ExoplanetModel = require("../../models/exoplanet.model");
const csv = require("fast-csv");

exports.exoplanetManageRenderAction = async (req, res) => {
  try {
    const exoplanetData = await ExoplanetModel.find({ isDeleted: false });

    Object.keys(exoplanetData).forEach(function (key) {
      var row = exoplanetData[key];
      row.planetImage =
        `${process.env.BASEURL}/assets/exoplanetImages/` + row.planetImage;
    });

    return res.render("Exoplanet/Exoplanets", {
      exoplanetData: exoplanetData,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addExoplanetManageRenderAction = async (req, res) => {
  try {
    return res.render("Exoplanet/AddExoplanet", {
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addExoplanetAction = async (req, res) => {
  try {
    const {
      planetName,
      hostName,
      planetType,
      numberOfStars,
      discoveryMethod,
      discoveryYear,
      discoveryFacility,
      solutionType,
      planetaryParameterReference,
      orbitalPeriodDays,
      planetMassOrMassSinIEarthMass,
      stellarParameterReference,
      stellarEffectiveTemperatureK,
      stellarSurfaceGravityLog10Cms2,
      systemParameterReference,
      raSexagesimal,
      raDeg,
      decSexagesimal,
      decDeg,
      distancePc,
      vJohnsonMagnitude,
      ks2MASSMagnitude,
      gaiaMagnitude,
      description,
    } = req.body;

    const exoplanetDetails = new ExoplanetModel({
      planetName: planetName,
      hostName: hostName,
      planetType: planetType,
      description: description,
      numberOfStars: numberOfStars,
      discoveryMethod: discoveryMethod,
      discoveryYear: discoveryYear,
      discoveryFacility: discoveryFacility,
      solutionType: solutionType,
      planetaryParameterReference: planetaryParameterReference,
      orbitalPeriodDays: orbitalPeriodDays,
      planetMassOrMassSinIEarthMass: planetMassOrMassSinIEarthMass,
      stellarParameterReference: stellarParameterReference,
      stellarEffectiveTemperatureK: stellarEffectiveTemperatureK,
      stellarSurfaceGravityLog10Cms2: stellarSurfaceGravityLog10Cms2,
      systemParameterReference: systemParameterReference,
      raSexagesimal: raSexagesimal,
      raDeg: raDeg,
      decSexagesimal: decSexagesimal,
      decDeg: decDeg,
      distancePc: distancePc,
      vJohnsonMagnitude: vJohnsonMagnitude,
      ks2MASSMagnitude: ks2MASSMagnitude,
      gaiaMagnitude: gaiaMagnitude,
    });

    await exoplanetDetails.save();

    req.flash("message", "New Exoplanet Added Successfully.");
    return res.redirect("/admin/exoplanets");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.deleteExoplanetAction = async (req, res) => {
  try {
    const { id } = req.params;

    await ExoplanetModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    )
      .then(() => {
        res.redirect("back");
        req.flash("message", "Delete Successfully!");
      })
      .catch((err) => {
        sendResponse(res, 400, { message: err.message });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addCsvExoplanetManageRenderAction = async (req, res) => {
  try {
    return res.render("Exoplanet/AddCsvExoplanet", {
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addCsvExoplanetAction = async (req, res) => {
  try {
    const fileRows = [];
    // Open uploaded file
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on("data", async (row) => {
        try {
          const exoplanet = new ExoplanetModel({
            planetName: row.planetName,
            hostName: row.hostName,
            planetType: row.planetType,
            description: row.description,
            numberOfStars: row.numberOfStars
              ? Number(row.numberOfStars)
              : undefined,
            discoveryMethod: row.discoveryMethod,
            discoveryYear: row.discoveryYear
              ? Number(row.discoveryYear)
              : undefined,
            discoveryFacility: row.discoveryFacility,
            solutionType: row.solutionType,
            planetaryParameterReference: row.planetaryParameterReference,
            orbitalPeriodDays: row.orbitalPeriodDays
              ? row.orbitalPeriodDays
              : "0",
            planetMassOrMassSinIEarthMass: row.planetMassOrMassSinIEarthMass
              ? row.planetMassOrMassSinIEarthMass
              : "0",
            stellarParameterReference: row.stellarParameterReference,
            stellarEffectiveTemperatureK: row.stellarEffectiveTemperatureK
              ? row.stellarEffectiveTemperatureK
              : "0",
            stellarSurfaceGravityLog10Cms2: row.stellarSurfaceGravityLog10Cms2
              ? row.stellarSurfaceGravityLog10Cms2
              : "0",
            systemParameterReference: row.systemParameterReference,
            raSexagesimal: row.raSexagesimal ? row.raSexagesimal : "0",
            raDeg: row.raDeg ? row.raDeg : "0",
            decSexagesimal: row.decSexagesimal,
            decDeg: row.decDeg ? row.decDeg : "0",
            distancePc: row.distancePc ? row.distancePc : "0",
            vJohnsonMagnitude: row.vJohnsonMagnitude
              ? row.vJohnsonMagnitude
              : "0",
            ks2MASSMagnitude: row.ks2MASSMagnitude ? row.ks2MASSMagnitude : "0",
            gaiaMagnitude: row.gaiaMagnitude ? row.gaiaMagnitude : "0",
          });

          // Validate the schema before saving
          await exoplanet.validate();
          fileRows.push(exoplanet);
        } catch (err) {
          console.error("Validation Error:", err.message);
        }
      })
      .on("end", async () => {
        try {
          // Bulk insert into MongoDB after validation
          await ExoplanetModel.insertMany(fileRows);
          // res.send(`${fileRows.length} rows imported successfully!`);
          req.flash("message", "CSV imported successfully!");
          res.redirect("/admin/exoplanets");
        } catch (err) {
          res.status(500).send("Error saving to database: " + err.message);
        }

        // Remove the uploaded file after processing
        fs.unlinkSync(req.file.path);
      })
      .on("error", (err) => {
        res.status(500).send("Error processing CSV file: " + err.message);
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.editCsvExoplanetManageRenderAction = async (req, res) => {
  try {
    const id = req.params.id;
    const exoplanetResults = await ExoplanetModel.findById(id);

    return res.render("Exoplanet/EditExoplanet", {
      exoplanetResults: exoplanetResults,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.editExoplanetImageAction = async (req, res, next) => {
  try {
    let id = req.params.id;
    const exoplanetData = await ExoplanetModel.findById(id);
    const file = req.file;
    let imagePlanet;

    if (file) {
      imagePlanet = req.file.filename;
      if (exoplanetData.planetImage) {
        const filePath = path.join(
          __dirname,
          "../../public/assets/exoplanetImages",
          exoplanetData.planetImage
        );

        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        } else {
          console.log("File not found, skipping deletion.");
        }
      }
    } else {
      imagePlanet = exoplanetData.planetImage;
    }

    await ExoplanetModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          planetImage: imagePlanet,
        },
      }
    )
      .then(() => {
        req.flash("message", "Image Updated Successfully.");
        return res.redirect("/admin/exoplanets");
      })
      .catch((err) => {
        req.flash("error", "Not Updated");
        res.redirect("back");
      });
  } catch (error) {
    req.flash("error", error.message);
  }
};
