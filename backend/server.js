import express from "express";
import router from './routes/authRouters.js'
import dotenv from 'dotenv'
import connectMongoDB from "./db/connectMongoDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import {v2} from 'cloudinary'
import   postRoutes from './routes/postRoutes.js'
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config()

v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json({limit:"5mb"}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use("/api/auth",router);
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)

// console.log(process.env.MONGO_URI)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB()
});
