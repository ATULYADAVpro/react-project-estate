import CustomErrorHandler from "../utils/CustomErrorHandler.js";
import JwtService from "../utils/JwtService.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if(!token){
        return next(CustomErrorHandler.unAuthorized())
    }

    try {
        const user = await JwtService.verify(token)
        
        req.user = user;
        next();
    } catch (error) {
        return next(error)
    }

}