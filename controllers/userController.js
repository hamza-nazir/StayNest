const User=require('../models/userSchema');


module.exports.renderSignUp=(req,res)=>{
    res.render('./users/signup')
};

module.exports.postSignup=async (req,res)=>{
    try{
    let{username,email,password}=req.body;
const newUser=  new User({username,email});
const registerUser= await User.register(newUser,password);
req.login(registerUser,(err)=>{
if(err){
  return next(err)
}else{
 req.flash("success","User Register Succesfully");
res.redirect('/listings')
}
})
}catch(e){
        req.flash("failure",e.message);
        res.redirect('/signup')
}
};

module.exports.renderLogin=(req,res)=>{
  res.render('./users/login.ejs')
};

module.exports.logout=(req,res,next)=>{
  req.logout(()=>{
req.flash("success","You logged out")
res.redirect('/listings')
  })
}