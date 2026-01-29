const { format } = require("morgan");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1-create nodemailer transporter (service that will send email like "gmail", "mailtrap")
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });
  // 2-define email options like from-to-subject-text-html
  const mailOptions = {
    form: `E-Commerce App`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3-send the email with transporter.sendMail() method
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
