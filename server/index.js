import express from "express"
import connectDB from "./utils/DB/connectDB.js";
import { PORT } from "./configs/index.js";
import authRoutes from "./routers/auth.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routers/user.router.js";
import cookieParser from "cookie-parser";
const app = express();




app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)


app.use(errorHandler)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server start at http://localhost:${PORT}`)
    })
}).catch(err => console.log(err))
