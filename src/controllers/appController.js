import mongoose from 'mongoose';
import { UserSchema } from '../models/appModel';
import { MarketPostSchema } from '../models/appModel';
import { MessageSchema } from '../models/appModel';
import { ChatSchema } from '../models/appModel';
import multer from 'multer'; // for image upload and storing


const MarketPost = mongoose.model('MarketPost', MarketPostSchema);
const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const Chat = mongoose.model('Chat', ChatSchema);

////  MarketPost controller
// multer tutorial used https://www.youtube.com/watch?v=srPXMt1Q0nY
// https://www.youtube.com/watch?v=5AaIJQcI0dI&t=369s
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        //cb(null, new Date().toISOString() + '-' + file.originalname);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

export const createNewMarketPost = (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return (err);
        }


        let newMarketPost = new MarketPost({
            species: req.body.species,
            breed: req.body.breed,
            image: req.file.path,
            price: req.body.price,
            sellerName: req.body.sellerName,
            sellerId: req.body.sellerId,
            description: req.body.description,

        });

        newMarketPost.save((err, marketPost) => {
            if (err) {
                res.send(err);
            }
            res.json(marketPost);
        });
    })


};

export const getMarketPosts = (req, res) => {
    MarketPost.find({}, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json(marketPost);
    });
};

export const getMarketPostWithID = (req, res) => {
    MarketPost.findById(req.params.marketPostId, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json(marketPost);
    });
}
export const getMarketPostBySellerId = (req, res) => { // get posts by seller id
    MarketPost.find({ sellerId: req.params.targetId }, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json(marketPost);
    });
}


export const updateMarketPost = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return (err);
        }

        // Assuming req.file is the updated image file, if any
        let updateFields = {
            species: req.body.species,
            breed: req.body.breed,
            price: req.body.price,
            sellerName: req.body.sellerName,
            description: req.body.description,
        };

        if (req.file) {
            updateFields.image = req.file.path;
        }

        MarketPost.findByIdAndUpdate(req.params.marketPostId, updateFields, { new: true }, (err, marketPost) => {
            if (err) {
                res.send(err);
            }
            res.json(marketPost);
        });
    });
};
export const deleteMarketPost = (req, res) => {
    MarketPost.deleteOne({ _id: req.params.marketPostId }, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted MarketPost' });
    })
}

// login Controller functionality
// https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/


export const SignUp = (req, res) => {

    if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be 6 or more characters" })
    }
    else {
        // if password is ok create user
        let newUser = new User({  // create user
            userName: req.body.userName,
            password: req.body.password
        })

        newUser.save((err, user) => { // save user
            if (err) {
                res.send(err);
            }
            res.json(user);
        });

    }
}

export const Login = async (req, res) => { //TODO refactor
    let authUser = req.body;
    if (!authUser.userName || !authUser.password) {
        return res.status(400).json({
            message: "Username or password not present"
        })
    }

    try {
        const isUser = await User.findOne(authUser);
        if (!isUser) {

            res.status(401).json({
                message: "LOGIN : UNSUCCESSFUL LOGIN",
                error: 'USER NOT FOUND',

            })
        }
        else {
            res.status(200).json({
                message: "LOGIN SUCCESSFUL",
                isUser,
            })
        }
    }
    catch (error) {
        console.log("Issue with " + authUser.userName + " : " + authUser.password);
        res.status(400).json({
            message: "LOGIN : ERROR HAS OCCURED",
            error: error.message,
        })
    }
}

////////////////////////////// Messenger ///////////////////////
export const sendMessage = async (req, res) => {
    const { senderId, recipientId, content } = req.body; // Extract data from request body

    try {
        // Check if a chat between the sender and recipient already exists
        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        // If a chat doesn't exist, create a new one
        if (!chat) {
            chat = await Chat.create({ participants: [senderId, recipientId], messages: [] });
        }

        // Add the new message to the chat's messages array
        chat.messages.push({ sender: senderId, content: content });

        // Save the updated chat document
        await chat.save();

        res.status(200).json({ message: "Message sent successfully", data: chat.messages });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const createChat = async (req, res) => {
    const { senderId, recipientId } = req.body; // Extract data from request body

    try {
        // Search db for a chat with both participants and return the chat
        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        // If chat doesnt exist create one
        if (!chat) {
            chat = await Chat.create({ participants: [senderId, recipientId], messages: [] });
        }
        //let chat getSelectedChat()
        console.log(chat);
        res.status(200).json({ chat });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getUserChats = async (req, res) => {
    try {
        const { userId } = req.params; // Extract user ID from request body

        // Find all chats where the user is a participant
        const chats = await Chat.find({ participants: userId });

        // Send the fetched chats as a response
        res.status(200).json({ chats });
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ error: 'Failed to fetch user chats' });
    }
};

export const getSelectedChat = async (req, res) => {
    try {
        const { chatId } = req.params; // Extract user ID from request body

        // Find all chats where the user is a participant
        const chat = await Chat.findById(chatId);
        console.log(chat);
        // Send the fetched chats as a response
        res.status(200).json({ chat });
    } catch (error) {
        console.error('Error fetching selected chat:', error);
        res.status(500).json({ error: 'Failed to fetch selected chat' });
    }
};

export const getUserName = async (req, res) => {
    try {
        const { userId } = req.params; // Extract user ID from request parameters

        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            // If user with the provided ID is not found, return a 404 response
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user's name in the response
        res.status(200).json({ userName: user.userName });
    } catch (error) {
        console.error('Error fetching user name:', error);
        res.status(500).json({ error: 'Failed to fetch user name' });
    }
};


