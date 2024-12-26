import express from 'express';
import { addNewAdmin, getAllDoctors, getUserDetails, login, logoutAdmin, logoutDoctor, logoutPatient, patientRegister } from '../controller/userController.js';



import { isAdminAuthenticated,isPatientAuthenticated,isDoctorAuthenticated } from '../middlewares/auth.js';

const router =express.Router();


router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/doctor/me", isDoctorAuthenticated,getUserDetails);
router.get("/admin/me", isAdminAuthenticated,getUserDetails);
router.get("/patient/me", isPatientAuthenticated,getUserDetails);
router.get("/admin/logout", isAdminAuthenticated,logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated,logoutPatient);
router.get("/doctor/logout", isDoctorAuthenticated,logoutDoctor)








export default router; // Correct default export