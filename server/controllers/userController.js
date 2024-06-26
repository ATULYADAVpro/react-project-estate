import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import CustomErrorHandler from "../utils/CustomErrorHandler.js";
import bcryptjs from "bcryptjs";

const userController = {
    test(req, res) {
        res.send("working")
    },

    async updateUser(req, res, next) {
        if (req.user.id !== req.params.id) { return next(CustomErrorHandler.unAuthorized()) }

        try {
            if (req.body.password) {
                req.body.password = bcryptjs.hashSync(req.body.password, 10)
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            }, { new: true })

            const { password, ...rest } = updatedUser._doc

            res.status(200).json(rest)

        } catch (error) {
            return next(error)
        }
    },

    async deleteUser(req, res, next) {
        if (req.user.id !== req.params.id) { return next(CustomErrorHandler.unAuthorized()) }
        try {
            console.log(req.params.id)
            await User.findByIdAndDelete(req.params.id)
            res.clearCookie('access_token')
            res.status(200).json('User has been deleted!')
        } catch (error) {
            return next(error)
        }
    },
    async getUserListing(req, res, next) {
        if (req.user.id === req.params.id) {
            try {
                const listing = await Listing.find({ userRef: req.params.id })
                res.status(200).json(listing)
            } catch (error) {
                next(error)
            }
        } else {
            return next(CustomErrorHandler.unAuthorized())
        }
    },

    async getUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return next(errorHandler(404, 'User not found!'));
            const { password: pass, ...rest } = user._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
    }

}

export default userController;