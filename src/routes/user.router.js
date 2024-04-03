import {Router} from 'express';
import registerUser from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { loginUser, logoutUser, refreshAccessToken } from '../controllers/user.controller.js';
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
export default router;