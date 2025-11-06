// src/models/Connection.ts
import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "accepted", "rejected"], 
        default: "pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Ensure a user can only send one connection request to another user
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const Connection = mongoose.models.Connection || mongoose.model("Connection", connectionSchema);
export default Connection;
