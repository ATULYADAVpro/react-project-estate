import { JWT_SECRECT } from "../configs/index.js";
import jwt from "jsonwebtoken"
class JwtService {
    static sign(payload, expiry = '60m', secret = JWT_SECRECT) {
        return jwt.sign(payload, secret)
    }

    static verify(token, secret = JWT_SECRECT) {
        return jwt.verify(token, secret)
    }
}

export default JwtService;