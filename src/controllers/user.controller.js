import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler( async (req,res) =>{

    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for imgs,check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return

     const {username, fullname, email, password} = req.body

    if (
        [username, fullname, email, password].some((field)=>
        field?.trim() === "")
    ) {
        throw new apiError(400,"All fields are required")
        
    }
    if (!email.includes('@')) { 
        throw new apiError(400, "Email should be correct");
    }

   const existedUser = await User.findOne({
        $or : [{ username },{ email  }]
    })

    if (existedUser) {
        throw new apiError(409,"User are already exists") 
        
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImgLocalPath = req.files?.coverImg[0]?.path; 

    let coverImgLocalPath 
    
    if (req.files && Array.isArray(req.files.coverImg)
         && req.files.coverImg.length > 0) 
        {
            coverImgLocalPath = req.files.coverImg[0].path
        }

    

    if (!avatarLocalPath) {
        throw new apiError(400,"Avatar file is required")
        
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg = await uploadOnCloudinary(coverImgLocalPath)

    if ( !avatar ) {
        throw new apiError(400,"Avatar file is required")
    }

   const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImg : coverImg?.url || "",
        email,
        username,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )

    if (!createdUser) {
        throw new apiError(500,"Something went wrong while registering the user")
        
    }

    return res.status(201).json(
        new apiResponse(200, createdUser,"User registered Successfully ")
    )


 
})

export {registerUser}