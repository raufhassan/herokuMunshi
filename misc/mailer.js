const nodemailer = require("nodemailer");
//const config = require("../misc/mailer");
//const Mailer = require("../config/mailer");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: Mailer.MAILGUN_USER,
    // pass: Mailer.MAILGUN_USER
    user: "raufhassan41@gmail.com",
    pass: "hazard17"
  }
  //   tls: {
  //     rejectUnauthorized: false
  //   }
});

/*  module.exports = {
  sendEmail(from, to, subject, text) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, text }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
}; 
 */
/* let mailOption = {
  from: "raufhassan41@gmail.com",
  to: "raufhassan41@yahoo.com",
  subject: "Testing",
  text: "its working"
};
 */
module.exports = function(mailOption) {
  transport.sendMail(mailOption, function(err, data) {
    if (err) {
      console.log("Error occured", err);
    } else {
      console.log("success");
    }
  });
};
