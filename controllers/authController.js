const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashpassword,
    });
    req.session.user = newUser;
    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (e) {
    console.log({ eee: e });
    res.status(400).json({ status: "fail" });
  }
};

exports.logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({
        status: "fail",
        message: "incorrect username or password",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({ status: "success" });
    } else {
      res.status(403).json({
        status: "fail",
        message: "incorrect username or password",
      });
    }
  } catch (e) {
    console.log({ eee: e });
    res.status(400).json({ status: "fail" });
  }
};
