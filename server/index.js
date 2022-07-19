const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");

app.use(
  cookieSession({
    name: "handsfree-session",
    keys: [
      /* secret keys */
    ],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("You are not logged in!"));
app.get("/failed", (req, res) => res.send("You Failed Login !"));
app.get("/good", isLoggedIn, (req, res) =>
  res.send(`환영합니다 ${req.user.email} 님`)
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.listen(5000, () => console.log("Listening on port 5000 !"));
