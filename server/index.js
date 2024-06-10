import express from "express"
import connectDB from "./utils/DB/connectDB.js";
import { PORT } from "./configs/index.js";
const app = express();

app.get("/",(req,res)=>{
    res.send("working")
})

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server start at http://localhost:${PORT}`)
    })
}).catch(err => console.log(err))
