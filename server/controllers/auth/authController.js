import User from "../../models/user.model.js";
import bcrypt from "bcryptjs"
import CustomErrorHandler from "../../utils/CustomErrorHandler.js";
import JwtService from "../../utils/JwtService.js";
const authController = {
    async signUp(req, res, next) {
        const { username, email, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashPassword })
        try {
            await newUser.save();
            res.status(200).json({ message: "Successfull", user: newUser })
        } catch (err) {
            return next(err)
        }
    },
    async signIn(req, res, next) {
        const { email, password } = req.body;

        try {
            const validUser = await User.findOne({ email })
            if (!validUser) {
                return next(CustomErrorHandler.notFound("user not find"))
            }

            const validPassword = bcrypt.compareSync(password, validUser.password)
            if (!validPassword) { return next(CustomErrorHandler.wrongCredentials()) }

            const { password: pass, ...rest } = validUser._doc;

            const access_token = JwtService.sign({ id: validUser._id })
            res.cookie("access_token", access_token, { httpOnly: true }).status(200).json(rest)

        } catch (error) {
            return next(error)
        }
    }
}

export default authController;