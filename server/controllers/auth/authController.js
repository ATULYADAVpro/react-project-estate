import User from "../../models/user.model.js";
import bcrypt from "bcryptjs"
const authController = {
    async signUp(req, res, next) {
        const { username, email, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashPassword })
        try {
            await newUser.save();
            res.status(200).json({message: "Successfull", user: newUser})
        } catch (err) {
            return next(err)
        }
    },
    index(req,res){
        res.send("working")
    }
}

export default authController;