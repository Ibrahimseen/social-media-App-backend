const express = require("express"); 

const { register ,login,  followORfolowingUser, Logout, updatePassword, updateprofile, deleteMyprofile, myprofile, GetuserProfile, getAllUser} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(Logout);

router.route("/follower/:id").get(isAuthenticated,followORfolowingUser);

router.route("/Upgrade/password").put(isAuthenticated,updatePassword);

router.route("/Upgrade/profile").put(isAuthenticated,updateprofile);

router.route("/delete/me").delete(isAuthenticated,deleteMyprofile);

router.route("/me").get(isAuthenticated,myprofile);

router.route("/users/:id").get(isAuthenticated,GetuserProfile);

router.route("/users").get(isAuthenticated,getAllUser);

module.exports = router;



