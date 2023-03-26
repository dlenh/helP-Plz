const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

// const bcrypt = require("bcrypt");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

// const nodemailer = require("nodemailer");
// const nodemailerSendgrid = require("nodemailer-sendgrid");
// const mailChecker = require("mailchecker");
// const { promisify } = require("util");
// const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");
// const Token = require("../models/Token");

// const randomBytesAsync = promisify(crypto.randomBytes);

// // helper function to send email
// const sendMail = (settings) =>  {
//   let transportConfig;
//   if (process.env.SENDGRID_API_KEY) {
//     transportConfig = nodemailerSendgrid({
//       apiKey: process.env.SENDGRID_API_KEY
//     });
//   } else {
//     transportConfig = {
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD
//       }
//     }
//   }
//   let transporter = nodemailer.createTransport(transportConfig);

//   return transporter.sendMail(settings.mailOptions)
//     .then(() => {
//       settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
//     })
//     .catch((err) => {
//       if (err.message === 'self signed certificate in certificate chain') {
//         console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
//         transportConfig.tls = transportConfig.tls || {};
//         transportConfig.tls.rejectUnauthorized = false;
//         transporter = nodemailer.createTransport(transportConfig);
//         return transporter.sendMail(settings.mailOptions)
//           .then(() => {
//             settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
//           });
//       }
//       console.log(settings.loggingError, err);
//       settings.req.flash(settings.errorType, { msg: settings.errorMsg });
//       return err;
//     });
// }

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  // if (!validator.isEmpty(req.body.password)) validationErrors.push({ msg: "Password cannot be blank." });  
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });


  // req.body.password = bcrypt.hashSync(req.body.password, 8);

  // user = new User({
  //   userName: req.body.userName,
  //   email: req.body.email,
  //   password: req.body.password,
  // });
  // user.save(function (err) {
  //   if (err) {
  //     return res.status(500).send({msg: err.message });
  //   }

  //   const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString("hex") });
  //   token.save(function (err) {
  //     if (err) {
  //       return res.status(500).send({msg: err.message });
  //     }

  //     const transporter = nodemailer.createTransport(
  //       sendgridTransport({
  //         auth: {
  //           api_key: process.env.SENDGRID_API_KEY,
  //         }
  //       })
  //     )

  //     const mailOptions = { from: "no-reply@helpplzsupport.gmail.com", to: user.email, subject: 'Account Verification Link', text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
  //     transporter.sendMail(mailOptions, function (err) {
  //       if (err) {
  //         return res.status(500).send({msg: "Technical Issue! Please click on resend for email verification."});
  //       }
  //       return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
  //     })
  //   })
  // })
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  // const token = await new Token({
  //   userId: user._id,
  //   token: crypto.randomBytes(32).toString("hex")
  // }).save();
  // const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
  // await sendEmail(user.email, "Verify Email", url);

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};

// exports.confirmEmail = function (req, res, next) {
//   Token.findOne({ token: req.params.token }, function (err, token) {
//       // token is not found into database i.e. token may have expired 
//       if (!token){
//           return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
//       }
//       // if token is found then check valid user 
//       else{
//           User.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
//               // not valid user
//               if (!user){
//                   return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
//               } 
//               // user is already verified
//               else if (user.verified){
//                   return res.status(200).send('User has been already verified. Please Login');
//               }
//               // verify user
//               else{
//                   // change isVerified to true
//                   user.verified = true;
//                   user.save(function (err) {
//                       // error occur
//                       if(err){
//                           return res.status(500).send({msg: err.message});
//                       }
//                       // account successfully verified
//                       else{
//                         return res.status(200).send('Your account has been successfully verified');
//                       }
//                   });
//               }
//           });
//       }
      
//   });
// };

// /**
//  * GET /account/verify/:token
//  * Verify email address
//  */
//  exports.getVerifyEmailToken = (req, res, next) => {
//   if (req.user.emailVerified) {
//     req.flash('info', { msg: 'The email address has been verified.' });
//     return res.redirect('/profile');
//   }

//   const validationErrors = [];
//   if (req.params.token && (!validator.isHexadecimal(req.params.token))) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
//   if (validationErrors.length) {
//     req.flash('errors', validationErrors);
//     return res.redirect('/profile');
//   }

//   if (req.params.token === req.user.emailVerificationToken) {
//     User
//       .findOne({ email: req.user.email })
//       .then((user) => {
//         if (!user) {
//           req.flash('errors', { msg: 'There was an error in loading your profile.' });
//           return res.redirect('back');
//         }
//         user.emailVerificationToken = '';
//         user.emailVerified = true;
//         user = user.save();
//         req.flash('info', { msg: 'Thank you for verifying your email address.' });
//         return res.redirect('/profile');
//       })
//       .catch((error) => {
//         console.log('Error saving the user profile to the database after email verification', error);
//         req.flash('errors', { msg: 'There was an error when updating your profile.  Please try again later.' });
//         return res.redirect('/profile');
//       });
//   } else {
//     req.flash('errors', { msg: 'The verification link was invalid, or is for a different account.' });
//     return res.redirect('/profile');
//   }
// };

// /**
//  * GET /account/verify
//  * Verify email address
//  */
//  exports.getVerifyEmail = (req, res, next) => {
//   if (req.user.emailVerified) {
//     req.flash('info', { msg: 'The email address has been verified.' });
//     return res.redirect('/profile');
//   }

//   if (!mailChecker.isValid(req.user.email)) {
//     req.flash('errors', { msg: 'The email address is invalid or disposable and can not be verified.  Please update your email address and try again.' });
//     return res.redirect('/profile');
//   }

//   const createRandomToken = randomBytesAsync(16)
//     .then((buf) => buf.toString('hex'));

//   const setRandomToken = (token) => {
//     User
//       .findOne({ email: req.user.email })
//       .then((user) => {
//         user.emailVerificationToken = token;
//         user = user.save();
//       });
//     return token;
//   };

//   const sendVerifyEmail = (token) => {
//     const mailOptions = {
//       to: req.user.email,
//       from: 'hackathon@starter.com',
//       subject: 'Please verify your email address on helP-Plz',
//       text: `Thank you for registering with helP-Plz.\n\n
//         This verify your email address please click on the following link, or paste this into your browser:\n\n
//         http://${req.headers.host}/account/verify/${token}\n\n
//         \n\n
//         Thank you!`
//     };
//     const mailSettings = {
//       successfulType: 'info',
//       successfulMsg: `An e-mail has been sent to ${req.user.email} with further instructions.`,
//       loggingError: 'ERROR: Could not send verifyEmail email after security downgrade.\n',
//       errorType: 'errors',
//       errorMsg: 'Error sending the email verification message. Please try again shortly.',
//       mailOptions,
//       req
//     };
//     return sendMail(mailSettings);
//   };

//   createRandomToken
//     .then(setRandomToken)
//     .then(sendVerifyEmail)
//     .then(() => res.redirect('/profile'))
//     .catch(next);
// };

