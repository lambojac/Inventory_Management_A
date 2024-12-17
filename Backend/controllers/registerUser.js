import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import genToken from "./tokenGen.js";
import sendEmail from "../utils/emailSender.js"; // Import your sendEmail utility
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        phone_number = "+234", // Default value for phone_number
        gender,
        country,
        state,
        date_of_birth,
        role = "member", // Default role if not provided
        emailConfirmationToken
    } = req.body;

    // Generate confirmation token if not provided
    const confirmationToken = emailConfirmationToken || crypto.randomBytes(20).toString("hex");

    // Validate required fields
    if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !gender ||
        !country ||
        !state ||
        !date_of_birth
    ) {
        res.status(400);
        throw new Error("Please provide all required fields.");
    }

    // Password length check
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters long.");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User already exists.");
    }

    // Ensure date_of_birth is a valid date
    const formattedDateOfBirth = new Date(date_of_birth);

    if (isNaN(formattedDateOfBirth)) {
        res.status(400);
        throw new Error("Invalid date format for date_of_birth.");
    }

    // Create new user with email confirmation status set to false
    const user = await User.create({
        first_name,
        last_name,
        email,
        password,
        phone_number,
        gender,
        country,
        state,
        date_of_birth: formattedDateOfBirth,
        role, // Use the role extracted from req.body, default is 'user'
        isEmailConfirmed: false, // Email not confirmed initially
        emailConfirmationToken: confirmationToken
    });

    // Send confirmation email
    const confirmationUrl = `${process.env.CLIENT_URL}/verify-successful/${confirmationToken}`;
    const message = `
        <p>Thank you for registering!</p>
        <p>Please click the link below to confirm your email address:</p>
        <a href="${confirmationUrl}">Confirm Email</a>
    `;
    sendEmail("Confirm Your Email", message, email, process.env.EMAIL_USER, process.env.EMAIL_USER);

    // Generate token for login
    const token = genToken(user._id);

    // Set HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day
        sameSite: "none",
        secure: true,
    });

    // Respond with user details and email confirmation token
    if (user) {
        const {
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
        } = user;

        res.status(201).json({
            id: _id,
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
            emailConfirmationToken: confirmationToken, // Send the generated token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});

export default registerUser;
