import { Router } from "express"
import authController from "../controllers/auth/authController.js";
const authRoutes = Router();

authRoutes.post("/signup",authController.signUp)
authRoutes.post("/signin",authController.signIn)
authRoutes.post("/google",authController.google)
authRoutes.get("/signout",authController.signOut)


export default authRoutes;