import { DEBUG_MODE } from "../configs/index.js";
import CustomErrorHandler from "../utils/CustomErrorHandler.js";

const errorHandler = (err,req,res,next)=>{
    let statusCode = 500;
    let data = {
        message: "Internal Server Error.",
        success: false,
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        data = {
            message: err.message,
            success: false,
        }
    }

    return res.status(statusCode).json(data)
}

export default errorHandler;