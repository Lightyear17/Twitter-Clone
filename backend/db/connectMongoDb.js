import mongoose from "mongoose";


const connectMongoDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // console.log(`mongoDb Conncet: ${conn.connection.host}`)
    } catch (e) {
        // console.log(e)
        process.exit(1)
    }



}


export default connectMongoDB