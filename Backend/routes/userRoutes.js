import express from 'express';
import registerUser from '../controllers/registerUser.js';
import { loginUser, logOut }  from '../controllers/logInLogOutUser.js';
import getUser from '../controllers/getUsers.js';
import Secure from '../middleware/authMiddleware.js';
import loggedInStatus from '../controllers/loggedInStatus.js';
import {getUserProfile, updateUser} from '../controllers/updateUser.js';
import { updatePassword, forgotPassword, resetPassword } from '../controllers/passwordController.js';
import confirmEmail from '../controllers/confirmEmail.js';



const router = express.Router();

//Routes
router.post('/register', registerUser);
router.get('/confirm-email/:token', confirmEmail);
router.post('/login', loginUser);
router.get('/getuser', Secure, getUser);
router.get('/logout', logOut);
router.get('/loggedin', loggedInStatus);
router.patch('/:user_id/updateuser', Secure, updateUser);
router.get('/:user_id/get_user_profile',getUserProfile)
router.patch('/updatepassword', Secure, updatePassword);
router.post('/forgotpassword',  forgotPassword);
router.put('/resetpassword/:resetToken',  resetPassword);

export default router; 
