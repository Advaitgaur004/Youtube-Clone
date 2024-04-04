import {Router} from 'express';
import registerUser from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { loginUser, logoutUser, refreshAccessToken, changepassword,updateAccount,updatecover } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();

router.route('/register').post(
    upload.fields(
        [
            {
                name: 'avatar',
                maxCount: 1
            },
            {
                name: 'cover',
                maxCount: 1
            }
        ]
    ),
    registerUser)

router.route('/login').post(loginUser)
router.route('/logout').get(verifyJWT,logoutUser)
router.route('/refresh').post(refreshAccessToken)
router.route('/changepassword').put(verifyJWT,changepassword)
router.route('/update').put(verifyJWT,updateAccount)
router.route('/updatecover').put(verifyJWT,upload,updatecover)

//router.route('/updatecover').put(verifyJWT,upload.single('coverimage'),updatecover)



export default router;