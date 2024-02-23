import { StatusCodes } from "http-status-codes"
import User from "../models/User.js"
import { BadRequestError, UnauthenticatedError } from "../utils/custom_errors.js"
import { comparePassword, hashPassword } from "../utils/password.js"
import { uploadImage } from "../utils/image.js"
import { createJWT } from "../utils/token.js"

export const register = async (req, res) => {
    const image = await uploadImage(req, `oxford-cuisine-storage/users/@${req.body.username}`)
    const password = await hashPassword(req.body.password)
    req.body.password = password
    const user = await User.create({...req.body, image})
    if(!user) throw new BadRequestError("An error occured")
    res.status(StatusCodes.OK).json("Registered")
}
export const login = async (req, res) => {
    const user = await User.findOne({username: req.body.username})
    if(!user) throw new BadRequestError('The username provided does not exist!')
    const validPassword = await comparePassword(req.body.password, user.password)
    if(!validPassword) throw new UnauthenticatedError('Wrong password!')
    const token = createJWT({id:user._id,role:user.role})
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now() + oneDay),
        secure:true
    })
    res.status(StatusCodes.OK).json("Logged in")
}
export const logout = async (req, res) => {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
    });
    res.status(StatusCodes.OK).json("Logged out")
};
export const fetch_user = async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user) throw new UnauthenticatedError("Invalid ID")
    res.status(StatusCodes.OK).json({ user });
}
export const delete_user = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id)
    if(!user) throw new BadRequestError('Error Deleting')
    res.status(StatusCodes.OK).json("");
}