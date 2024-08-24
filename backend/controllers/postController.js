import User from "../model/UserModel.js";
import Post from "../model/PostModel.js";
import Notification from "../model/NotificationModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    // const { text } = req.query;
    // let { img } = req.query;
    let {text,img} = req.body
    
    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    
    if (!text && !img)
      return res.status(400).json({ message: "Text or image is required" });

    if (img) {
        const uploadResponse = await cloudinary.uploader.upload(img);
        img = uploadResponse.secure_url;
        
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

   

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    // console.log(req.params);

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // console.log("post user", post.user.toString());
    // console.log("owner", userId.toString());
    if (post.user.toString() !== userId.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // console.log(post.img);
    // if (post.img) {
    //     const imgId = post.img.split("/").pop().split(".")[0];
    //     await cloudinary.uploader.destroy(imgId);
    // }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const userLikedPost = post.likes.includes(userId);
    

    if (userLikedPost) {
      await Post.updateOne({ _id: postId },{ $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            likedPosts: postId,
          },
        }
      );

      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();

      const updatedLikes = post.likes;
     
      res.status(200).json( updatedLikes );
    }
  } catch (error) {
   
    res.status(500).json({ error: error.message });
  }
};

export const CommentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

   

    if (!text) {
      return res.status(400).json({ error: "Text field is reqired" });
    }

    const post = await Post.findById(postId);
    // console.log("post", post);
    if (!post) {
      return res.status({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (post.length === 0) {
      return res.status(202).json([]);
    }
    
    res.status(200).json(post);
  } catch (error) {
    
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likes } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
   
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
    if(!user) return res.status(404).json({error:"User not found"})

      const following = user.following

      const feedPost = await Post.find({user:{$in:following}}).sort({createdAt:-1})
      .populate({path:"user",select:"-password"})
      .populate({path:"comments.user",select:"-password"})


      res.status(200).json(feedPost)


  }
  catch(error){

 
		res.status(500).json({ error: "Internal server error" });




  }
}



export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		
		res.status(500).json({ error: "Internal server error" });
	}
};