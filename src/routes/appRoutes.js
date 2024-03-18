import {
    createNewMarketPost,
    getMarketPosts,
    getMarketPostWithID,
    updateMarketPost,
    deleteMarketPost,
    Register,
    Login,
    SignUp,
    getMarketPostBySellerId
} from '../controllers/appController';


const routes = (app) => {
    // marketPost
    app.route('/marketPost')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, getMarketPosts)

        // POST endpoint
        .post(createNewMarketPost);

    app.route('/marketPost/:marketPostId')
        // get specific marketPost
        .get(getMarketPostWithID)

        // put request
        .put(updateMarketPost)

        // delete request
        .delete(deleteMarketPost);

    app.route('/sellerId/:targetId')
        // get all posts by a specific seller
        .get(getMarketPostBySellerId)

    app.route('/signUp')
        .post((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, SignUp);

    app.route('/login')
        .post((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, Login);
}



export default routes;
