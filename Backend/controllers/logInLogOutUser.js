import User from "../models/userModel.js";
import asynchandler from "express-async-handler";
import bcrypt from "bcryptjs";
import genToken from "./tokenGen.js";



const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide correct email and password.");
    }
    
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("User not found, Please sign up!");
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
        res.status(400);
        throw new Error("Please confirm your email before logging in.");
    }

    // Check password
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid) {
        // Generate token
        const token = genToken(user._id);

        // Send cookie to server
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 24 * 60 * 60), // Expires in 1 day
            sameSite: "none",
            secure: true,
        });

        // Respond with user details and token
        const { _id, first_name, last_name, email, phone_number, gender, country, state, date_of_birth, role } = user;
        res.status(200).json({
            _id,
            first_name,
            last_name,
            email,
            phone_number,
            gender,
            country,
            state,
            date_of_birth,
            role,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid Email or password.");
    }
});

const logOut = asynchandler( async (req, res) => {
    // expire the session
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date,
        sameSite:"none",
        secure:true
    });
    return res.status(200).json({ message: "Sucessfully logged out"});
});

export  { loginUser, logOut };
