const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exoplanetQuizSchema = new Schema(
  {
    exoplanet_id: {
      type: Schema.Types.ObjectId,
      ref: "exoplanet",
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    option_a: {
      type: String,
    },
    option_b: {
      type: String,
    },
    option_c: {
      type: String,
    },
    option_d: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ExoplanetQuizModel = mongoose.model(
  "exoplanet_quiz",
  exoplanetQuizSchema
);
module.exports = ExoplanetQuizModel;
