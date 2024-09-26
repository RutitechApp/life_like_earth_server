const ExoplanetModel = require("../../models/exoplanet.model");
const ExoplanetQuizModel = require("../../models/exoplanets-quiz.model");

exports.exoplanetQuizManageRenderAction = async (req, res) => {
  try {
    const exoplanetQuizData = await ExoplanetQuizModel.find({
      isDeleted: false,
    }).populate("exoplanet_id");

    return res.render("ExoplanetQuiz/ExoplanetQuiz", {
      exoplanetQuizData: exoplanetQuizData,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addExoplanetQuizManageRenderAction = async (req, res) => {
  try {
    const exoplanetData = await ExoplanetModel.find({ isDeleted: false });

    return res.render("ExoplanetQuiz/AddExoplanetQuiz", {
      exoplanetData: exoplanetData,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.addExoplanetQuizAction = async (req, res) => {
  try {
    const {
      exoplanet_id,
      question,
      answer,
      option_a,
      option_b,
      option_c,
      option_d,
    } = req.body;

    const exoplanetQuizData = new ExoplanetQuizModel({
      exoplanet_id,
      question,
      answer,
      option_a,
      option_b,
      option_c,
      option_d,
    });

    await exoplanetQuizData.save();
    req.flash("message", "Exoplanet Quiz added successfully.");
    return res.redirect("/admin/exoplanets-quiz");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.editExoplanetManageRenderAction = async (req, res) => {
  try {
    const id = req.params.id;
    const exoplanetQuizResults = await ExoplanetQuizModel.findOne({
      _id: id,
    }).populate("exoplanet_id");

    return res.render("ExoplanetQuiz/EditExoplanetQuiz", {
      exoplanetQuizResults: exoplanetQuizResults,
      message: req.flash("message"),
      error: req.flash("error"),
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.editExoplanetQuizAction = async (req, res) => {
  try {
    const id = req.params.id;
    const exoplanetQuizResults = await ExoplanetQuizModel.findOne({
      _id: id,
    });
    await ExoplanetQuizModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          question: req.body.question
            ? req.body.question
            : exoplanetQuizResults.question,
          answer: req.body.answer
            ? req.body.answer
            : exoplanetQuizResults.answer,
          option_a: req.body.option_a
            ? req.body.option_a
            : exoplanetQuizResults.option_a,
          option_b: req.body.option_b
            ? req.body.option_b
            : exoplanetQuizResults.option_b,
          option_c: req.body.option_c
            ? req.body.option_c
            : exoplanetQuizResults.option_c,
          option_d: req.body.option_d
            ? req.body.option_d
            : exoplanetQuizResults.option_d,
        },
      }
    )
      .then(() => {
        req.flash("message", "Exoplanet Quiz Updated Successfully.");
        return res.redirect("/admin/exoplanets-quiz");
      })
      .catch((err) => {
        req.flash("error", "Not Updated");
        res.redirect("back");
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

exports.deleteExoplanetQuizAction = async (req, res) => {
  try {
    const { id } = req.params;

    await ExoplanetQuizModel.findByIdAndUpdate(
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