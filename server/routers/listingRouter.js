import { Router } from "express";
import listingController from "../controllers/listingController.js";
import { verifyToken } from "../middlewares/verifyUser.js";
const listingRoutes = Router();


listingRoutes.get("/test",listingController.test)
listingRoutes.post("/create",verifyToken,listingController.createListing)
listingRoutes.delete("/delete/:id",verifyToken,listingController.deleteListing)
listingRoutes.post("/update/:id",verifyToken,listingController.updateListing)

export default listingRoutes