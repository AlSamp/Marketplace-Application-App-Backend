import {
    addNewContact,
    getContacts,
    getContactWithID,
    updateContact,
    deleteContact,

    addNewMarketPost,
    getMarketPosts,
    getMarketPostWithID,
    updateMarketPost,
    deleteMarketPost
} from '../controllers/appController';

//const multer = require('multer');
//const upload = multer({dest:'upload'});

const routes = (app) => {
    app.route('/contact')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, getContacts)

        // POST endpoint
        .post(addNewContact);

    app.route('/contact/:contactId')
        // get specific contact
        .get(getContactWithID)

        // put request
        .put(updateContact)

        // delete request
        .delete(deleteContact);

    // post
    app.route('/marketPost')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, getMarketPosts)

        // POST endpoint
        .post(addNewMarketPost);

    app.route('/marketPost/:marketPostId')
        // get specific marketPost
        .get(getMarketPostWithID)

        // put request
        .put(updateMarketPost)

        // delete request
        .delete(deleteMarketPost);
}



export default routes;
