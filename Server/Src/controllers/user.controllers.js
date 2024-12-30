import userModels from "../models/user.models.js";
import bcrypt from "bcrypt";
import { access } from "fs";
import jwt from "jsonwebtoken";
// import cookieparser from "cookieparser";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

export const createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const user = await userModels.create({
        name,
        email,
        password: hashPassword,
        isAdmin,
        
    });
    res.status(201).json({
        massage: "User created successfully",
        user
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logInUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", user, accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(refreshToken, process.env.SECRET_KEY);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: "Refresh token successful", newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// middlewere 
export const authenticateUser = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(404).json({ message: "no token found" });
  

    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "invalid token" });
      req.user = user;
      next();
    });
  };


export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModels.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
