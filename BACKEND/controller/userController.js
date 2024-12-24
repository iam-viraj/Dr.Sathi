import { compareSync } from "bcrypt";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"

// Register Patient
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    anotherPhone, 
    dob, 
    gender, 
    password, 
    role 
  } = req.body;

  // Validation: Ensure all fields are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !anotherPhone ||
    !dob ||
    !gender ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if user is already registered
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  // Create a new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    anotherPhone,
    dob,
    gender,
    password,
    role,
  });
  generateToken(user,"User Registered !",200,res)
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  // // Debugging to see the input body
  // console.log("Request Body:", req.body);

  // Validation: Ensure all fields are provided
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password do not match!", 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 401));
  }

  // Compare passwords
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!", 401));
  }

  // Validate user role
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid Role!", 401));
  }
  generateToken(user,"User Logged in Successfully",200,res)

  
});


export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    anotherPhone, 
    dob, 
    gender, 
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !anotherPhone ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} with this Email Already Registered!`, 400))
  }
  const admin = await User.create({ firstName,
    lastName,
    email,
    phone,
    anotherPhone,
    dob,
    gender,
    password,
    role:"Admin"
   });
   res.status(201).json({ success: true, message:"New Admin Registered!" });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({role:"Doctor"});
  res.status(200).json({ success: true, doctors });
});

export const getUserDetails =catchAsyncErrors(async(req, res,next) =>{
  const user = req.user;
  res.status(200).json({ success: true, user });

});