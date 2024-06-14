import { Router } from "express";
import listingController from "../controllers/listingController.js";
import { verifyToken } from "../middlewares/verifyUser.js";
const listingRoutes = Router();


listingRoutes.get("/test",listingController.test)
listingRoutes.post("/create",verifyToken,listingController.createListing)
listingRoutes.delete("/delete/:id",verifyToken,listingController.deleteListing)
listingRoutes.post("/update/:id",verifyToken,listingController.updateListing)
listingRoutes.get("/get/:id",listingController.getListing)
listingRoutes.get("/get",listingController.getListings)

export default listingRoutes