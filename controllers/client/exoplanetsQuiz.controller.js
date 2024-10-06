const { default: mongoose } = require("mongoose");
const ExoplanetQuizModel = require("../../models/exoplanets-quiz.model");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");
const ExoplanetModel = require("../../models/exoplanet.model");

exports.getExoplanetsQuizAction = async (req, res) => {
  try {
    const { exoplanetId } = req.params;

    // Validate the exoplanetId
    if (!mongoose.Types.ObjectId.isValid(exoplanetId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid exoplanet ID",
        status: HttpStatus.BAD_REQUEST,
        success: false,
        data: {},
      });
    }

    const exoplanetData = await ExoplanetModel.findById(exoplanetId).lean();

    const exoplanetsQuizData = await ExoplanetQuizModel.aggregate([
      {
        $match: {
          isDeleted: false,
          exoplanet_id: new mongoose.Types.ObjectId(exoplanetId),
        },
      },
    ]);

    // Check if data was found
    if (!exoplanetsQuizData.length) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "No quiz data found for this exoplanet",
        status: HttpStatus.NOT_FOUND,
        success: false,
        data: {},
      });
    }

    const formattedQuizData = exoplanetsQuizData.map((quizItem, index) => ({
      id: quizItem._id,
      question: quizItem.question,
      options: [
        quizItem.option_a,
        quizItem.option_b,
        quizItem.option_c,
        quizItem.option_d,
      ],
      correctAnswer: quizItem.answer,
    }));

    return res.status(HttpStatus.OK).json({
      message: ResponseMessage.get_exoplanets_quiz_successfully,
      status: HttpStatus.OK,
      success: true,
      data: {
        exoplanetData: {
          planetName: exoplanetData.planetName,
          hostName: exoplanetData.hostName,
          planetImage: `${
            process.env.LIVEURL +
            "/assets/exoplanetImages/" +  
            exoplanetData.planetImage
          }`,
        }, // Single exoplanet data
        quizData: formattedQuizData, // Quiz data related to the exoplanet
      },
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      data: {},
    });
  }
};
