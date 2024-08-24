import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { createPost,likeUnlikePost,deletePost,CommentOnPost,getLikedPosts, getAllPosts,getFollowingPosts,getUserPosts} from '../controllers/postController.js'


const postRoutes = express.Router()


postRoutes.get("/all",protectRoute,getAllPosts)
postRoutes.get("/following", protectRoute, getFollowingPosts);
postRoutes.get("/liked/:id",protectRoute,getLikedPosts)
postRoutes.post("/create",protectRoute,createPost)
postRoutes.post("/like/:id",protectRoute,likeUnlikePost)
postRoutes.post("/comment/:id",protectRoute,CommentOnPost)
postRoutes.get("/user/:username", protectRoute, getUserPosts);

postRoutes.delete("/:id",protectRoute,deletePost)


export default postRoutes