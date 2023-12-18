const Post = require("../models/post");
const User = require("../models/user");


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(404).json({
                success: false,
                message: "User already exists"
            });
        }
        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: "sample_id", url: "sampleurl" },
        });

        
        const token = await user.generateToken();
        
        const options = {
            httpOnly:true,
            expires:new Date (Date.now()+90*24*60*60*1000),
            secure: true, 
        };

        res.status(201).cookie("token",token, options).json({
            success:true,
            user,
            token,
            // message:"Welcome Back"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const  user = await User.findOne({email}).select("+password");

        if(!user) {return res.status(400).json({
            success:false,
            message:"user does not exist",
        });
    }
        const ismatch = await user.matchPassword(password)

        if(!ismatch) { 
            return res.status(400).json({
            success:false,
            message:"Incorrect Password",
        });
    }
    const options = {
        httpOnly:true,
        expires:new Date (Date.now()+90*24*60*60*1000),
        secure: true, 
    }

    const token = await user.generateToken();

    res.status(200).cookie("token",token, options).json({
        success:true,
        user,
        token,
        // message:"Welcome Back"
    })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.Logout = async(req,res) => {
    try {
        res.status(200).cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true,
        }).json({
            success:true,
            message:"Logout"
        })     
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
   
}



exports.followORfolowingUser = async(req,res) => {
    try {
        const userTofollow =  await User.findById(req.params.id);
        const logedinUser = await User.findById(req.user._id);

    if(!userTofollow) return res.status(404).json({
            success:true,
            message:"User Not Found",
        });

    if(logedinUser.following.includes(userTofollow._id)) {  
        const indexfollowing = logedinUser.following.indexOf(userTofollow._id);
        const indexfollower = userTofollow.followers.indexOf(logedinUser._id);

        logedinUser.following.splice(indexfollowing,1)
        userTofollow.followers.splice(indexfollower,1)

        await logedinUser.save();
        await userTofollow.save();

        return res.status(200).json({
            success:true,
            message:"UnFollwing",
        })
        }
else{
    
    logedinUser.following.push(userTofollow._id);
    userTofollow.followers.push(logedinUser._id);

    await logedinUser.save();
    await userTofollow.save();

    return res.status(200).json({
        success:true,
        message:"Following",
    })
}


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updatePassword = async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const {oldPassword, newPassword} = req.body;
        const ismatch = await user.matchPassword(oldPassword)

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"Please Provide Old and new password",
            });
        }

        if(!ismatch) 
        {
            return res.status(400).json({
            success:false,
            message:"Incorrect old Passwords",
        }); 
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success:true,
        message:"password updated",
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateprofile = async (req,res) => {
    try {
    const user  = await User.findById(req.user._id);
        const { name,email } = req.body;

        if(!name || !email){
            return res.status(400).json({
                success:false,
                message:"Please Provide a userName or email"
            })
        }
        if(user){
            user.name= name
        }
        if(email){
            user.email= email
        }

    await  user.save();

    res.status(200).json({
        success:true,
        message:"Profile updated"
    })
} catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteMyprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        await user.deleteOne();

        for (let i = 0; i < posts.length; i++) {
            await Post.findByIdAndDelete(posts[i]);
        }

        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }

        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
        }

        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Profile deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



exports.myprofile = async (req,res) => {
    try {
     const user = await User.findById(req.user._id);

    res.status(200).json({
    success:true,
    user,    
})
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};
exports.GetuserProfile = async ( req,res ) => {
try {
    
    const user = await User.findById(req.params.id).populate("posts");
    if(!user) 
    return res.status(501).json({
    success:false,
    message:"user not found",
    
})


    res.status(201).json({
        success:true,
        user,
    })
} catch (error) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
}
};


exports.getAllUser = async (req,res) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            success:true,
            users,
        })

    } catch (error) {
        
    }
};


