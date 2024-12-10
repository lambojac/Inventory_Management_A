const roleSchema = new mongoose.Schema({
    rolename: {
        type: String,
        enum: ["admin", "creator", "advertiser", "member"],
        default: "member",
    
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
