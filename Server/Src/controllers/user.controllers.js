import userModels from "../models/user.models.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieparser from "cookieparser"

const AccesesToken = (user) => {
    return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1d" });
}
const RefreshToken = (user) => {
    return jwt.sign({ user }, process.env.REFRESH_KEY, { expiresIn: "7d" });
}

export const createUser = async (req, res) => {
    const { name, email, password ,isAdmin} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await userModels.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
       
        const cookie = cookieparser(user)
        
        const user = await userModels.create({ name, email, password:hashPassword ,isAdmin});
        res.status(201).json({massage:"User created successfully",user, token: AccesesToken(user)});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const logInUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await userModels.findOne({ email });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid password" });
        }

        const cookie = cookieparser.parse(req.headers.cookie || '');
        if (cookie.refreshToken) {
            const refreshToken = cookie.refreshToken;
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
            if (decoded.user && decoded.user._id === user._id) {
                const newAccessToken = AccesesToken(user);
                const newRefreshToken = RefreshToken(user);
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.json({ accessToken: newAccessToken });
                return;
            }
        }

        res.status(200).json({ message: "Login successful" ,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





export const getAllUsers = async (req, res) => {
    try {
        const users = await userModels.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};