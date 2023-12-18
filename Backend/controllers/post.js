const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = async (req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: req.body.public_id,
                url: req.body.url,
                    },
            owner: req.user._id,
                };
             const post = await Post.create(newPostData);
             const user = await User.findById(req.user._id);
             user.posts.push(post._id);

            await user.save();

            res.status(201).json({
            success: true,
            post,
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};


exports.Deletepost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await Post.deleteOne({ _id: req.params.id });

        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        if (index !== -1) {
            user.posts.splice(index, 1);
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Post deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



exports.LikeAndUnlikePost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({
            success:false,
            message:"post Not Found",
        });

        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
             await post.save();
            return res.status(200).json({
            success:true,
            message:"post Dislike",
            });
        }
        else{
            post.likes.push(req.user._id)
             await post.save();
             return res.status(200).json({
                success:true,
                message:"post Liked",
             });

        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getPostFollowing = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const posts = await Post.find({
        owner:{
            $in : user.following,
        }
      })
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
exports.updatecaption = async(req,res) => {
 try {
    const post = await Post.findById(req.params.id);
    if(!post) {
        return res.status(404).json({
            success:false,
            message:"Post Not found",
        })
    }
    if(post.owner.toString() !== req.user._id.toString()){
        res.status(401).json({
            success:false,
            message:"Unauthorized",
        })
    }
    post.caption = req.body.caption;
    await post.save()
    res.status(201).json({
        success:true,
        message:"caption updated"
    })
 } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
      });
 }

};



  
  
  