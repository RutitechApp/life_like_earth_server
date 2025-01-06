const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1m",
  },
});

const OtpModel = mongoose.model("otp", otpSchema);

// Drop the existing index and recreate it with the correct expiration time
OtpModel.collection.dropIndex({ createdAt: 1 }, (err, result) => {
  if (err) {
    console.error("Error dropping index:", err);
  } else {
    OtpModel.createIndexes({ createdAt: 1 }, { expireAfterSeconds: 60 });
  }
});

module.exports = OtpModel;