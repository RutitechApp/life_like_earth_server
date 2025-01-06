const QuizResultModel = require("../../models/quiz-result.model");
const ExoplanetQuizModel = require("../../models/exoplanets-quiz.model");
const { default: mongoose } = require("mongoose");
const { HttpStatus } = require("../../utils/httpStatusCode");
const { ResponseMessage } = require("../../utils/responseMessage");
const UserModel = require("../../models/user.model");

exports.submitQuizAction = async (req, res) => {
    try {
        const id = req.user;
        const checkUserData = await UserModel.findOne({ _id: id });
        if (!checkUserData) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.please_try_to_correct_credentials,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }

        const { exoplanetId, answers } = req.body;

        if (!mongoose.Types.ObjectId.isValid(exoplanetId)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: ResponseMessage.invalid_exoplanet_id,
                status: HttpStatus.BAD_REQUEST,
                success: false,
                data: {},
            });
        }

        const quizQuestions = await ExoplanetQuizModel.find({
            exoplanet_id: exoplanetId,
            isDeleted: false,
        });

        if (!quizQuestions || !quizQuestions.length) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.no_quiz_questions_found_for_this_exoplanet,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        let score = 0;
        const processedAnswers = answers.map((userAnswer) => {
            const question = quizQuestions.find(
                (q) => q._id.toString() === userAnswer.questionId
            );

            if (!question) {
                return {
                    questionId: userAnswer.questionId,
                    selectedOption: userAnswer.selectedOption,
                    isCorrect: false,
                };
            }

            const optionMap = {
                A: question.option_a,
                B: question.option_b,
                C: question.option_c,
                D: question.option_d,
            };

            const isCorrect = optionMap[userAnswer.selectedOption] === question.answer;

            if (isCorrect) score++;

            return {
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
                isCorrect,
            };
        });

        const quizResult = new QuizResultModel({
            userId: checkUserData._id,
            exoplanetId,
            answers: processedAnswers,
            score,
        });
        await quizResult.save();

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.quiz_submitted_successfully,
            status: HttpStatus.OK,
            success: true,
            data: {
                score,
                totalQuestions: quizQuestions.length,
                correctAnswers: score,
                answers: processedAnswers,
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

exports.getUserQuizResults = async (req, res) => {
    try {
        const id = req.user;
        const checkUserData = await UserModel.findOne({ _id: id });
        if (!checkUserData) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: ResponseMessage.please_try_to_correct_credentials,
                status: HttpStatus.UNAUTHORIZED,
                success: false,
                data: {},
            });
        }

        const userQuizResults = await QuizResultModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(checkUserData._id) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "exoplanets",
                    localField: "exoplanetId",
                    foreignField: "_id",
                    as: "exoplanetDetails",
                },
            },
            {
                $unwind: {
                    path: "$exoplanetDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        _id: "$userDetails._id",
                        name: "$userDetails.name",
                        email: "$userDetails.email",
                    },
                    quiz: {
                        exoplanet: "$exoplanetDetails",
                        score: "$score",
                        answers: "$answers",
                    },
                },
            },
        ]);

        if (!userQuizResults.length) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: ResponseMessage.no_quiz_results_found_for_the_specified_user,
                status: HttpStatus.NOT_FOUND,
                success: false,
                data: {},
            });
        }

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.user_quiz_results_fetched_successfully,
            status: HttpStatus.OK,
            success: true,
            data: userQuizResults,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
            success: false,
            data: {},
        });
    }
};