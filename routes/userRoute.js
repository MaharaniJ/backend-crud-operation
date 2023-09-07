const express = require("express");
const router = express.Router();
const User = require("../models/userModels");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.find({ email: email });
    if (user) {
      return res.json({ message: "User already registered" });
    } else {
      const newuser = User.create({
        name: name,
        email: email,
        password: password,
      });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      console.log(hash);
      user.password = hash;
      console.log(user.password);
      await newuser.save();
      return res.status(200).json({ message: "User Registered successfully!" });
    }
  } catch (error) {
    return error;
  }

  //   console.log("Welcome to register page!");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = User.findOne({ email: email });
    if (!findUser) {
      return res.json({ message: "User not found" });
    }
    bcrypt.compare(password, findUser.password, (err, data) => {
      if (err) throw err;
      if (data) res.status(200).json({ message: "Login successful" });
      else res.status(403).json({ message: "Invalid Credentials" });
    });
  } catch (error) {
    return res.status(403).json({ message: "Login failed" });
  }
});

router.post("/user", (req, res) => {
  console.log("Welcom to post page!");
});

router.get("/users", (req, res) => {
  console.log("Welcome to users page!");
});

router.get("/user/:id", (req, res) => {
  console.log("Welcome to get a user page!");
});

router.put("/user/:id", (req, res) => {
  console.log("Welcom to put page!");
});

router.delete("/user/:id", (req, res) => {
  console.log("Welcom to delete page!");
});

module.exports = router;
