import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const confirmEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ emailConfirmationToken: token });

    if (!user) {
        res.status(400);
        throw new Error("Invalid or expired confirmation token.");
    }

    // Set email as confirmed
    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined; // Remove token after confirmation
    await user.save();

    res.status(200).json({
        message: "Email successfully confirmed. You can now log in.",
    });
});

export default confirmEmail;
