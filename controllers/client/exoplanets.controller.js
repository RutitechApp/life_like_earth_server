const ExoplanetModel = require("../../models/exoplanet.model");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");

exports.getExoplanetsAction = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

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
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
    ]);

    const totalCount = await ExoplanetModel.countDocuments({ isDeleted: false });

    return res.status(HttpStatus.OK).json({
      message: ResponseMessage.get_exoplanets_successfully,
      status: HttpStatus.OK,
      success: true,
      data: exoplanetsData,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
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
