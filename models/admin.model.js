const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const adminSchema = new Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    
    token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      { _id: this.id },
      process.env.ACCESS_ADMIN_AUTH_TOKEN_SECRET
    );

    this.token = await token;
    await this.save();
    return token;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel;
