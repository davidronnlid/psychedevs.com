// auth.js

/**
 * Required External Modules
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");

require("dotenv").config();
const dbo = require("./server/db/conn");

/**
 * Routes Definitions
 */
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Save user data to DB
      let db_connect = dbo.getDb();
      db_connect.collection("records").insertOne(user, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });

      // Set route to return to
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  const loggingOut = () => {
    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo =
        process.env.NODE_ENV === "production"
          ? `${returnTo}/`
          : `${returnTo}:${port}/`;
    }

    const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);

    const searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: returnTo,
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
  };

  req.logOut((err) => (err ? err : loggingOut()));
});

router.get("/logged-in-user", (req, res, next) => {
  res.send("Data");
});

/**
 * Module Exports
 */
module.exports = router;
