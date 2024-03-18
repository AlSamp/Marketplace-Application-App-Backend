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

