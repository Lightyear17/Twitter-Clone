import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications,deleteNotification } from "../controllers/notificationController.js";


const notificationRoutes = express.Router();

notificationRoutes.get("/",protectRoute,getNotifications);
notificationRoutes.delete("/",protectRoute,deleteNotification);


export default notificationRoutes;