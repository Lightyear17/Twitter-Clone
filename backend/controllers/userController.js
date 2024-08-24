import { v2 } from "cloudinary";
import User from "../model/UserModel.js";
import Notification from "../model/NotificationModel.js";



export const getUserProfile = async (req, res) => {
  const { userName } = req.params;

  try {
    let user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userToModify = await User.findById(id);

    const currentUser = await User.findById(req.user._id);
    

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    let isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
    }
  } catch (error) {
   

    res.status(500).json({ error: error.message });
  }
};



export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // Exclude the current user
          _id: { $nin: userFollowedByMe.following } // Exclude users already followed
        },
      },
      {
        $sample: { size: 10 }, // Randomly sample 10 users
      },
      {
        $limit: 4 // Limit the results to 4
      },
      {
        $project: { 
          password: 0 // Exclude the password field from the output
        }
      }
    ]);

    res.status(200).json(users);
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};


export const updateUser = async (req, res) => {
  let { fullName, email,userName,currentPassword,newPassword,  bio, link } = req.query;
  let { profileImg, coverImg } = req.body;

  

  let userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({ message: "Please provide both password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await becrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Incorrect password" });
      }

      if (newPassword.lenght < 6) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if(profileImg) {
      if(user.profileImg){
        // console.log(user.profileImg.split("/").pop().split(".")[0])
          await v2.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await v2.uploader.upload(profileImg );
       profileImg = uploadedResponse.secure_url;
    }

    if(coverImg){

      if(user.coverImg){
          await v2.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
      }


      const uploadedResponse = await v2.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save()

    user.password = null;

    return res.status(200).json(user);


  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};






// export const getSuggestedUsers = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const userFollowedByMe = await User.findById(userId).select("following");

//     const users = await User.aggregate([
//       {
//         $match: {
//           _id: { $ne: userId },
//         },
//       },
//       {
//         $sample: { size: 10 },
//       },
//     ]);

//     const filteredUsers = users.filter(
//       (user) => !userFollowedByMe.following.includes(user._id)
//     );
//     const suggestedUsers = filteredUsers.slice(0, 4);

//     suggestedUsers.forEach((user) => (user.password = null));
//     res.status(200).json(suggestedUsers);
//   } catch (error) {
//     console.log("Error in getSuggestedUsers: ", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };