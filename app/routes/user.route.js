//To Create a Router File , We need to Use Express , You will understand the reason for using Express in below lines
import express from 'express'
//A Router will Make use of the Controller Functions , So we need to import a controlle
import userController from '../controllers/user.controller.js'
import passport from 'passport'
import __ from '../../helpers/globalFunctions.js'

//This is why we need Express.
//Express Router Allows us to Create Routers Specific for Every Module allowing to Export and Import Whereever requried and Improves Code Readability
const router = express.Router()

router.post('/signup',userController.signUpUser);
router.post('/login',userController.loginUser);

//All the Routes below this passport Authentication will require a JWT Token
router.use(passport.authenticate('jwt',{
    session:false
}),
    (req,res,next)=>{
        if(req.user){
            next();
        }else{
            return __.out(res,401,"Unauthorized")
        }
    }

)

router.get('/user',userController.getAllUsers);
//As I mentioned above , We need to Export the Routers In order to be used somewhere within the application
export default router;