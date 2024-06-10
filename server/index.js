import express from "express"
import connectDB from "./utils/DB/connectDB.js";
import { PORT } from "./configs/index.js";
import authRoutes from "./routers/user.router.js";
import errorHandler from "./middlewares/errorHandler.js";
const app = express();

app.use(express.json())
app.use('/api/auth', authRoutes)


app.use(errorHandler)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server start at http://localhost:${PORT}`)
    })
}).catch(err => console.log(err))
