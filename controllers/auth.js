const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// To fetch error validation on routes
const { validationResult } = require("express-validator");
const User = require("../models/user");

// Get page login /login
exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Se connecter",
    path: "/login",
    // user need to be auth to access
    isAuthenticated: false,
    // fetch message of flash in req
    errorMessage: message,
    oldInput: { email: "" },
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: { email: "" },
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // validation fails 422. No redirect to render same page for user's experience
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email },
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};
// Post page login /login authentification
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Se connecter",
      path: "/login",
      // user need to be auth to access
      isAuthenticated: false,
      // fetch message of flash in req
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email },
    });
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        // error message with flash, arg: key error and message
        req.flash("error", "Email ou mot de passe invalide");
        return res.redirect("login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            console.log(user);
            req.session.isLoggedIn = true;
            // if redirect to fast and sure to save session in db
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          req.flash("error", "Email ou mot de passe invalide");
          res.redirect("login");
        })
        .catch((err) => {
          res.redirect("login");
        });
    })
    // to continue if had an user
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};
// Post page logout /logout deconnection
exports.postLogout = (req, res) => {
  // method of session's package on session object
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
// Reset password page
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Réinitialiser le mot de passe",
    isAuthenticated: false,
    errorMessage: message,
  });
};
// Generate token to reset password
exports.postReset = (req, res, next) => {
  const email = req.body.email;
  // nbr octets // buffer= tampon des octets
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      res.redirect("/reset");
    }
    // store hexadecimal values toString => ASCII normal
    const token = buffer.toString("hex");
    // should store in db on the user object => User model
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          req.flash("error", "Aucun compte trouvé avec cet email.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        // date now + 1h mms
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        // express'll go in error handling middleware
        return next(error);
      });
  });
};
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Nouveau mot de passe",
        errorMessage: message,
        userId: user.id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    where: {
      resetToken: passwordToken,
      resetTokenExpiration: { [Op.gt]: Date.now() },
      id: userId,
    },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // express'll go in error handling middleware
      return next(error);
    });
};
