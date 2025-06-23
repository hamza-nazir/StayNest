const express = require('express');
const router=express.Router({mergeParams:true});

const passport = require('passport');
const { saveURL } = require('../middleware');
const userController=require('../controllers/userController');


router.route('/signup')
.get(userController.renderSignUp)
.post(userController.postSignup);

router.route('/login')
.get( userController.renderLogin)
.post(saveURL,
  passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true} ),
    function (req,res) {
       req.flash('success',"Welcome");
       let URL=res.locals.redirectUrl||"/listings"
      res.redirect(URL)  } 
);



router.get('/logout',userController.logout)
module.exports=router;