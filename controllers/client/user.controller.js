const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user.model");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");
const { default: mongoose } = require("mongoose");
const generateOtp = require("../../functions/helper");
const sendEmail = require("../../functions/emailService");
const OtpModel = require("../../models/otp.model");
const BlacklistedTokenModel = require("../../models/blacklistedToken.model");

exports.userRegisterAction = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, mobileNumber } =
            req.body;

        const userData = await UserModel.findOne({ email: email });
        const mobileData = await UserModel.findOne({ mobileNumber: mobileNumber });
        if (userData) {
            return res.status(HttpStatus.FOUND).json({
                message: ResponseMessage.email_already_associate_with_another_account,
                status: HttpStatus.FOUND,
                success: false,
                data: {},
            });
        }
        if (mobileData) {
            return res.status(HttpStatus.FOUND).json({
                message:
                    ResponseMessage.mobile_number_already_associate_with_another_account,
                status: HttpStatus.FOUND,
                success: false,
                data: {},
            });
        }

        if (password == confirmPassword) {
            const userDetails = new UserModel({
                fullName,
                email,
                password,
                mobileNumber,
            });
            await userDetails.save();
            return res.status(HttpStatus.CREATED).json({
                message: ResponseMessage.user_register_successfully,
                status: HttpStatus.CREATED,
                success: true,
                data: {},
            });
        } else {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.password_not_matched,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: {},
        });
    }
};

exports.userLoginAction = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUserData = await UserModel.findOne({ email: email });

        if (!checkUserData) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.email_id_is_not_exist,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        const isMatch = await bcrypt.compare(password, checkUserData.password);
        if (!isMatch) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.invalid_credentials,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }
        const token = await checkUserData.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || "development",
        });

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.login_successfully,
            status: HttpStatus.OK,
            success: true,
            token: token,
            data: {
                _id: checkUserData._id,
                fullName: checkUserData.fullName,
                email: checkUserData.email,
                mobileNumber: checkUserData.mobileNumber,
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

exports.getLoginUserAction = async (req, res) => {
    try {
        const id = req.user;
        const userData = await UserModel.aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $eq: new mongoose.Types.ObjectId(id) } },
                        { isDeleted: { $eq: false } },
                    ],
                },
            },
            {
                $project: {
                    password: 0,
                    isDeleted: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                }
            }
        ]);

        if (!userData || userData.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.user_not_found,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.get_login_user_info_successfully,
            status: HttpStatus.OK,
            success: true,
            data: userData,
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
        });
    }
};

exports.forgetPasswordAction = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await UserModel.findOne({ email: email });

        if (!userData) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.email_id_is_not_exist,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        const random = await generateOtp();
        const otpSend = sendEmail(userData.email, random, `Forgot Password Otp`);

        if (otpSend != "0") {
            await OtpModel.create({
                userId: userData._id,
                email: userData.email,
                otp: random,
            });

            return res.status(HttpStatus.OK).json({
                message: ResponseMessage.forgot_password_link_sent_on_your_email,
                status: HttpStatus.OK,
                success: true,
                data: {},
            });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.please_try_to_correct_credentials,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
        });
    }
};

exports.verifyForgotPasswordOtpAction = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.email_or_otp_number_is_required,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        let otpData = await OtpModel.findOne({
            email: email,
            isDeleted: false,
        });

        if (otpData.otp === otp) {
            await OtpModel.findOneAndUpdate(
                {
                    _id: otpData._id,
                },
                {
                    $set: { isDeleted: true },
                }
            )
                .then(async () => {
                    return res.status(HttpStatus.OK).json({
                        message: ResponseMessage.otp_verified_successfully,
                        status: HttpStatus.OK,
                        success: true,
                        data: {},
                    });
                })
                .catch((err) => {
                    return res.status(HttpStatus.NOT_MODIFIED).json({
                        message: err.message,
                        status: HttpStatus.NOT_MODIFIED,
                        success: false,
                        data: {},
                    });
                });
        } else {
            return res.status(HttpStatus.FOUND).json({
                message: ResponseMessage.otp_not_matched,
                status: HttpStatus.FOUND,
                success: false,
                data: {},
            });
        }
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: {},
        });
    }
};

exports.resetPasswordAction = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        const userData = await UserModel.findOne({ email: email });

        if (password == confirmPassword) {
            await UserModel.findOneAndUpdate(
                {
                    _id: userData._id,
                },
                {
                    $set: { password: await bcrypt.hash(password, 8) },
                }
            )
                .then(() => {
                    return res.status(HttpStatus.OK).json({
                        message: ResponseMessage.password_changed_successfully,
                        status: HttpStatus.OK,
                        success: true,
                        data: {},
                    });
                })
                .catch((err) => {
                    console.log("🚀 ~ err:", err);
                    return res.status(HttpStatus.NOT_MODIFIED).json({
                        message: ResponseMessage.password_not_changed,
                        status: HttpStatus.NOT_MODIFIED,
                        success: false,
                        data: {},
                    });
                });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: ResponseMessage.password_not_matched,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                data: {},
            });
        }
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: {},
        });
    }
};

exports.resendOtpAction = async (req, res) => {
    try {
        const { email } = req.body;

        const userData = await UserModel.findOne({ email: email });

        if (!userData) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.email_id_is_not_exist,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }

        const random = await generateOtp();
        const otpSend = sendEmail(userData.email, random, `Resend Password Otp`);

        if (otpSend != "0") {
            await OtpModel.create({
                userId: userData._id,
                email: userData.email,
                otp: random,
            });

            return res.status(HttpStatus.OK).json({
                message: ResponseMessage.otp_sent_successfully,
                status: HttpStatus.OK,
                success: true,
                data: {},
            });
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.please_try_to_correct_credentials,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: {},
        });
    }
};

exports.userLogoutAction = async (req, res) => {
    try {
        const blacklistedToken = new BlacklistedTokenModel({ token: req.token });

        await blacklistedToken.save();

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || "development",
        });

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.logout_successfully,
            status: HttpStatus.OK,
            success: true,
            data: {},
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