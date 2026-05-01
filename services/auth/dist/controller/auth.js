import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middleware/trycatch.js";
import { oauth2Client } from "../config/googleConfig.js";
import axios from "axios";
// method 1 without TryCatch middleware
// export const loginUser = async (req: Request, res: Response) => {
//     res.json(req.body);
//     console.log("Login user called", res.json(req.body));
//     try{
//         const {email, name, picture} = req.body;
//         let user = await User.findOne({email});
//         if(!user){
//             user = await User.create({
//                 name,
//                 email,
//                 image: picture,
//             });
//         }
//         const token = jwt.sign({user}, process.env.JWT_SECRET as string, {
//             expiresIn: "15d",
//         });
//         res.status(200).json({
//             message: "Logged success",
//             token,
//             user,
//         })
//     } catch(error: any){
//         console.error("Error in loginUser:", error);
//         res.status(500).json({message: "Server error"});
//     }
// }
// method 2 with TryCatch middleware
export const loginUser = TryCatch(async (req, res) => {
    console.log("Login route hit", req.body);
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            message: "Authorization code is required",
        });
    }
    const googleResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleResponse.tokens);
    const userRespponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`);
    // const {email, name, picture} = req.body;
    const { email, name, picture } = userRespponse.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    });
    res.status(200).json({
        message: "Logged In success",
        token,
        user,
    });
});
const allowedRoles = ["customer", "rider", "seller"];
export const addUserRole = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user, Please Login - no user in request" });
    }
    const { role } = req.body;
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    });
    res.json({ user, token });
});
export const myProfile = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user, Please Login - no user in request" });
    }
    const user = req.user;
    res.json({ user });
});
