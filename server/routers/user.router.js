import { Router } from "express"
import authController from "../controllers/auth/authController.js";
const authRoutes = Router();

authRoutes.get("/",authController.index)
authRoutes.post("/signup",authController.signUp)



export default authRoutes;
