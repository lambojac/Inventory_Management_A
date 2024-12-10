import UserProfile from "../models/UserProfile.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc Get user profile with populated data
// @route GET /api/user-profiles/:user_id
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    // Find the user profile and populate user details
    const userProfile = await UserProfile.findOne({ user_id }).populate("user_id", "first_name last_name email gender date_of_birth");

    if (!userProfile) {
        res.status(404);
        throw new Error("User profile not found");
    }

    res.status(200).json(userProfile);
});

// @desc Update user profile
// @route PUT /api/user-profiles/:user_id
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { address, profile_picture, chosen_category } = req.body;

    // Find the existing profile or create a new one if it doesn't exist
    let userProfile = await UserProfile.findOne({ user_id });

    if (!userProfile) {
        // Ensure the referenced user exists before creating a new profile
        const userExists = await User.findById(user_id);
        if (!userExists) {
            res.status(404);
            throw new Error("User not found");
        }

        userProfile = new UserProfile({ user_id });
    }

    // Update the fields with provided data or retain existing values
    userProfile.address = address || userProfile.address;
    userProfile.profile_picture = profile_picture || userProfile.profile_picture;
    userProfile.chosen_category = chosen_category || userProfile.chosen_category;

    // Save the updated profile
    const updatedProfile = await userProfile.save();

    res.status(200).json(updatedProfile);
});


