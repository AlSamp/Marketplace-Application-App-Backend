import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    phone: {
        type: String
    },
    project: {
        type: String
    },
    notes: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

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
