import mongoose from 'mongoose';
import { UserSchema } from '../models/appModel';
import { MarketPostSchema } from '../models/appModel';
import multer from 'multer'; // for image upload and storing


const MarketPost = mongoose.model('MarketPost', MarketPostSchema);
const User = mongoose.model('User', UserSchema);

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


// export const updateMarketPost = (req, res) => {
//     MarketPost.findByIdAndUpdate({ _id: req.params.marketPostId }, req.body, { new: true }, (err, marketPost) => {
//         console.log('Request Body:', req.body);

//         if (err) {
//             res.send(err);
//         }
//         res.json(marketPost);
//     })
// }

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

