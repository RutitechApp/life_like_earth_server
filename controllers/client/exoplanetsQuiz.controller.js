const { default: mongoose } = require("mongoose");
const ExoplanetModel = require("../../models/exoplanet.model");
const ExoplanetQuizModel = require("../../models/exoplanets-quiz.model");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");

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

    const exoplanetsQuizData = await ExoplanetQuizModel.aggregate([
      {
        $match: {
          isDeleted: false,
          exoplanet_id: new mongoose.Types.ObjectId(exoplanetId),
        },
      },
      {
        $lookup: {
          from: "exoplanets",
          localField: "exoplanet_id",
          foreignField: "_id",
          as: "exoplanetsData",
        },
      },
      {
        $unwind: {
          path: "$exoplanetsData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "exoplanetsData.planetImage": {
            $concat: [
              process.env.BASEURL,
              "/assets/exoplanetImages/",
              "$exoplanetsData.planetImage",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$exoplanet_id",
          exoplanetsData: { $first: "$exoplanetsData" },
          quizQuestions: {
            $push: {
              _id: "$_id",
              question: "$question",
              answer: "$answer",
              option_a: "$option_a",
              option_b: "$option_b",
              option_c: "$option_c",
              option_d: "$option_d",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $project: {
          exoplanetsData: {
            isDeleted: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
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

    return res.status(HttpStatus.OK).json({
      message: ResponseMessage.get_exoplanets_quiz_successfully,
      status: HttpStatus.OK,
      success: true,
      data: exoplanetsQuizData,
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

// exports.getExoplanetsQuizAction = async (req, res) => {
//     try {
//       const { exoplanetId } = req.params;

//       const exoplanetsQuizData = await ExoplanetQuizModel.aggregate([
//         {
//           $match: {
//             isDeleted: false,
//             exoplanet_id: new mongoose.Types.ObjectId(exoplanetId),
//           },
//         },
//         {
//           $lookup: {
//             from: "exoplanets",
//             localField: "exoplanet_id",
//             foreignField: "_id",
//             as: "exoplanetsData",
//           },
//         },
//         {
//           $unwind: {
//             path: "$exoplanetsData",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $addFields: {
//             "exoplanetsData.planetImage": {
//               $concat: [
//                 process.env.BASEURL,
//                 "/assets/exoplanetImages/",
//                 "$exoplanetsData.planetImage",
//               ],
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0, // Exclude the default _id from the output if not needed
//             "exoplanetsData": 1, // Include exoplanetsData
//             quizQuestions: {
//               _id: "$_id",
//               question: "$question",
//               answer: "$answer",
//               option_a: "$option_a",
//               option_b: "$option_b",
//               option_c: "$option_c",
//               option_d: "$option_d",
//               createdAt: "$createdAt",
//               updatedAt: "$updatedAt",
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$exoplanetsData._id", // Group by the exoplanet ID
//             exoplanetsData: { $first: "$exoplanetsData" }, // Keep the exoplanetsData
//             quizQuestions: { $push: "$quizQuestions" }, // Push each quizQuestion into the array
//           },
//         },
//         {
//           $unwind: "$quizQuestions" // Unwind the quizQuestions array
//         },
//         {
//           $replaceRoot: {
//             newRoot: {
//               exoplanetsData: "$exoplanetsData",
//               quizQuestion: "$quizQuestions", // Flatten quizQuestion
//             },
//           },
//         },
//       ]);

//       return res.status(HttpStatus.OK).json({
//         message: ResponseMessage.get_exoplanets_quiz_successfully,
//         status: HttpStatus.OK,
//         success: true,
//         data: exoplanetsQuizData,
//       });
//     } catch (error) {
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: error.message,
//         status: HttpStatus.INTERNAL_SERVER_ERROR,
//         success: false,
//         data: {},
//       });
//     }
//   };
