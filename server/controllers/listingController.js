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
    },

    async getListing(req, res, next) {
        try {
            const listing = await Listing.findById(req.params.id)
            if (!listing) { return next(CustomErrorHandler.notFound("not found")) }
            res.status(200).json(listing)

        } catch (error) {
            return next(error)
        }
    },
    async getListings(req, res, next) {
        try {
            let limit = parseInt(req.query.limit) || 9;
            let startIndex = parseInt(req.query.startIndex) || 0;
            let offer = req.query.offer;

            if (offer === undefined || offer === 'false') {
                offer = { $in: [false, true] };
            }

            let furnished = req.query.furnished;

            if (furnished === undefined || furnished === 'false') {
                furnished = { $in: [false, true] };
            }

            let parking = req.query.parking;

            if (parking === undefined || parking === 'false') {
                parking = { $in: [false, true] };
            }

            let type = req.query.type;

            if (type === undefined || type === 'all') {
                type = { $in: ['sale', 'rent'] };
            }


            let searchTerm = req.query.searchTerm || "";
            let sort = req.query.sort || "createdAt";
            let order = req.query.order || "desc";


            const listings = await Listing.find({
                name: { $regex: searchTerm, $options: 'i' },
                offer,
                furnished,
                parking,
                type,
            }).sort({ [sort]: order }).limit(limit).skip(startIndex);

            return res.status(200).json(listings)


        } catch (error) {
            return next(error)
        }
    }



}

export default listingController;