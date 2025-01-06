const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizResultSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        exoplanetId: {
            type: Schema.Types.ObjectId,
            ref: "exoplanet",
            required: true,
        },
        answers: [
            {
                questionId: {
                    type: Schema.Types.ObjectId,
                    ref: "exoplanet_quiz",
                    required: true,
                },
                selectedOption: {
                    type: String,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        score: {
            type: Number,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const QuizResultModel = mongoose.model("quiz_result", quizResultSchema);

module.exports = QuizResultModel;