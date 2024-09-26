const passport = require("passport");
const passportLocal = require("passport-local");
const AdminModel = require("../models/admin.model");
const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, cb) => {
      try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
          return cb(null, false, { message: "Unauthorized User" });
        }
        // Assuming you are using plain text passwords, you should use bcrypt or similar for security
        if (admin.password !== password) {
          return cb(null, false, { message: "Incorrect password" });
        }
        const user = {
          id: admin.id,
          email: admin.email,
          isAdmin: admin.isAdmin,
        };
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await AdminModel.findById(id);
    if (user) {
      const userObj = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      cb(null, userObj);
    } else {
      cb(null, false, { message: "Unauthorized User" });
    }
  } catch (err) {
    cb(err);
  }
});
