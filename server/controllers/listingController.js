import Listing from "../models/listing.model.js";

const listingController = {
    test(req, res) {
        res.send("Working")
    },

    async createListing(req, res, next) {
        try {
            const listing = await Listing.create(req.body)
            return res.status(200).json(listing)
        } catch (error) {
            return next(error)
        }
    },

   

}

export default listingController;