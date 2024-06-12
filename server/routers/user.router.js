import { Router } from "express"
import userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyUser.js";
const userRoutes = Router();
userController


userRoutes.get("/test",userController.test)
userRoutes.post("/update/:id",verifyToken,userController.updateUser)
userRoutes.delete("/delete/:id",verifyToken,userController.deleteUser)

export default userRoutes;