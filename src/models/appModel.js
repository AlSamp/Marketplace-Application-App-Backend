import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MarketPostSchema = new Schema({
    species: {
        type: String,
        required: 'Enter the Animal Species'
    },
    breed: {
        type: String,
        required: 'Enter the breed'
    },
    image: {
        type: String,
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    sellerName: {
        type: String
    },
    sellerId: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

export const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true, // no duplicate user names allowed
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic"

    }
});

export const MessageSchema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat', // Reference to the Chat model
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const ChatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model for participants in the chat
    }],
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});