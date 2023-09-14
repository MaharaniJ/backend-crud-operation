const express = require("express");
const router = express.Router();
const User = require("../models/userModels");
const LoginUser = require("../models/loginSchema");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await LoginUser.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already registered" });
    }
    const newUser = new LoginUser({
      name: name,
      email: email,
      password: password,
    });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    await newUser.save();
    return res.status(200).json({ message: "User Registered successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await LoginUser.findOne({ email: email });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (isPasswordValid) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.post("/createuser", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.get("/getusers", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(404).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

router.get("/getuser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/updateuser/:id", async (req, res) => {
  const id = req.params.id;
  // const {} = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate({ _id: id }, req.body);

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updateUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
