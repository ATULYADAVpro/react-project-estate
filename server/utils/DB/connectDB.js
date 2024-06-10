import mongoose from "mongoose";
import { DB_URL } from "../../configs/index.js";

const connectDB = async ()=>{
    try {
        await mongoose.connect(DB_URL);
        console.log(`DataBase conneted!..` )
    } catch (err) {
        console.log("DB not connect" + err)
    }
}


export default connectDB;