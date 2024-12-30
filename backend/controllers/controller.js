import e from "express";
import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokens.js";

export const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ error: "Username  is alredy taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exist" });
        }

        if (password.lenght < 6) {
            return res
                .status(400)
                .json({ error: "Password must be 6 atleast character long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileimg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).catch({ error: "Internal Server Error" });
        }
    } catch (error) {

        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
     


        if (!userName || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileimg: user.profileImg,
            coverImg: user.coverImg,
            redirectUrl: `/me/${user._id}`
        });
    } catch (error) {

        res.status(400).json({ error: "check your username or password" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: " Logged out succesfully" });
    } catch (error) {

        res.status(500).json({ error: "Internal sesrver error" });
    }
};

export const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {

        res.status(500).json({ error: "Internal Server Error" });
    }
};

