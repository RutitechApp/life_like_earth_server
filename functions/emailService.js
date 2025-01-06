const nodemailer = require("nodemailer");

const sendEmail = (receiverEmail, random, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: receiverEmail,
    subject: "Life Like Earth - Your One-Time Password (OTP)",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center;">
          <h1 style="color: #4CAF50;">Life Like Earth</h1>
          <p style="font-size: 18px; color: #000;">Your One-Time Password (OTP) for ${message} is:</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; display: inline-block; margin: 20px 0;">
            <h2 style="color: #333; font-size: 24px; margin: 0;">${random}</h2>
          </div>
          <p style="font-size: 16px; color: #000;">Please use this OTP to complete your request process. It is valid for 1 minutes.</p>
          <p style="font-size: 16px; color: #000;">If you didn't request this, please ignore this email.</p>
        </div>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #000; text-align: center;">
          Life Like Earth Inc.<br>
          1234 Street, City, State, Zip Code<br>
          <a href="mailto:support@LifeLikeEarth.com" style="color: #4CAF50; text-decoration: none;">4LifeLikeEarth@gmail.com</a>
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("🚀 ~ transporter.sendMail ~ error:", error);
    } else {
      console.log("🚀 ~ mail send successfully ~ info:", info.response);
    }
  });
};
module.exports = sendEmail;