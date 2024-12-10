import mongoose from "mongoose"
const userProfileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    chosen_category: {
        type: [String], // Array of chosen categories
        default: [],
    },
}, { timestamps: true });

export default mongoose.model("UserProfile", userProfileSchema);
