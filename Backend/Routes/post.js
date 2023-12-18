const express = require("express"); 
const { createPost, LikeAndUnlikePost, Deletepost, getPostFollowing, updatecaption } = require("../controllers/post");
const {isAuthenticated} =require ( "../middlewares/auth")


const router = express.Router();


router.route("/post/upload").post( isAuthenticated ,createPost);
router.route("/post").get(isAuthenticated,getPostFollowing);
router.route("/post/:id").get( isAuthenticated ,LikeAndUnlikePost)
.put(isAuthenticated,updatecaption)
.delete(isAuthenticated,Deletepost);




module.exports = router;