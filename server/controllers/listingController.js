import Listing from "../models/listing.model.js";
import CustomErrorHandler from "../utils/CustomErrorHandler.js";

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

    async deleteListing(req, res, next) {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(CustomErrorHandler.notFound())
        }

        if (req.user.id !== listing.userRef) {
            return next(CustomErrorHandler.unAuthorized())
        }

        try {
            await Listing.findByIdAndDelete(req.params.id)
            res.status(200).json('Listing has been deleted!')

        } catch (error) {
            next(error)
        }
    },

    async updateListing(req, res, next) {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(CustomErrorHandler.notFound("listing not found"))
        }

        if (req.user.id !== listing.userRef) {
            return next(CustomErrorHandler.unAuthorized("Own listing only update"))
        }

        try {
            const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })

            res.status(200).json(updatedListing)
        } catch (error) {
            return next(error)
        }
    }



}

export default listingController;