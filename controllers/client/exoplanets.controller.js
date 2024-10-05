const ExoplanetModel = require("../../models/exoplanet.model");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");

exports.getExoplanetsAction = async (req, res) => {
  try {
    const exoplanetsData = await ExoplanetModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $addFields: {
          planetImage: {
            $concat: [
              process.env.LIVEURL,
              "/assets/exoplanetImages/",
              "$planetImage",
            ],
          },
        },
      },
    ]);
    return res.status(HttpStatus.OK).json({
      message: ResponseMessage.get_exoplanets_successfully,
      status: HttpStatus.OK,
      success: true,
      data: exoplanetsData,
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
