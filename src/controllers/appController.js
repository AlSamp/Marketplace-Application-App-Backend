import mongoose from 'mongoose';
import { ContactSchema } from '../models/appModel';
import { MarketPostSchema } from '../models/appModel';
import multer from 'multer'; // for image upload and storing


const Contact = mongoose.model('Contact', ContactSchema);
const MarketPost = mongoose.model('MarketPost', MarketPostSchema);

export const addNewContact = (req, res) => {
    let newContact = new Contact(req.body);

    newContact.save((err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
};

export const getContacts = (req, res) => {
    Contact.find({}, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
};

export const getContactWithID = (req, res) => {
    Contact.findById(req.params.contactId, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
}

export const updateContact = (req, res) => {
    Contact.findByIdAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    })
}

export const deleteContact = (req, res) => {
    Contact.deleteOne({ _id: req.params.contactId }, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted contact' });
    })
}

////  Post controller
// multer tutorial used https://www.youtube.com/watch?v=srPXMt1Q0nY
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

export const addNewMarketPost = (req, res) => {

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

export const updateMarketPost = (req, res) => {
    MarketPost.findByIdAndUpdate({ _id: req.params.marketPostId }, req.body, { new: true }, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json(marketPost);
    })
}

export const deleteMarketPost = (req, res) => {
    MarketPost.deleteOne({ _id: req.params.marketPostId }, (err, marketPost) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted MarketPost' });
    })
}

