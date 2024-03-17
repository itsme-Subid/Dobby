import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dkHE6GAXFBP9KoNlrTYZhfC43jvzRyMw";

// POST "/api/users/signup"
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    try {
      // search if user already exists
      let user = await User.findOne({
        name: req.body.name,
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }
      // hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch {
      console.log(err.message);
      res.status(500).send("Internal Server Error!\nSomething went wrong!");
    }
  }
);

// LOGIN ROUTE: Authenticate a user using POST "/api/users/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with valid email and password" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please login with valid email and password" });
      }
      // Create a new JWT token and return it
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!\nSomething went wrong!");
    }
  }
);

// DELETE "/api/users/deleteuser"
router.delete("/deleteuser", fetchUser, async (req, res) => {
  try {
    // Get user details from the database
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    res.json({
      success: true,
      msg: "User has been deleted successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!\nSomething went wrong!");
  }
});

export default router;
