const AdminModel = require("../models/admin.model");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // const token = req.cookies.jwt;
    const token = req?.headers?.authorization?.split(" ")[1];
    const verifyUser = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await AdminModel.findOne({ _id: verifyUser._id });

    if (admin) {
      req.token = token;
      req.admin = admin;
      next();
    } else {
      console.log("====================================");
      console.log("User");
      console.log("====================================");
      // const user = await UserModel.findOne({ _id: verifyUser._id });
      // req.token = token;
      // req.user = user;
      // next();
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: 400,
    });
  }
};

module.exports = userAuth;
