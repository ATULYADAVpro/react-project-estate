import { Router } from "express"
import userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyUser.js";
const userRoutes = Router();
userController


userRoutes.get("/test",userController.test)
userRoutes.post("/update/:id",verifyToken,userController.updateUser)
userRoutes.delete("/delete/:id",verifyToken,userController.deleteUser)
userRoutes.get("/listings/:id",verifyToken,userController.getUserListing)
userRoutes.get("/:id",verifyToken,userController.getUser)

export default userRoutes;