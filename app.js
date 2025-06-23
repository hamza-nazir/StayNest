require('dotenv').config()



const mongoose = require('mongoose');
const express = require('express');
const app = express();
const methodOverride = require('method-override')
app.use(methodOverride("_method"))
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const listingRouter=require('./routes/listingRoute.js');
const reviewsRouter=require('./routes/reviewRoute.js');
const userRouter=require('./routes/userRoute.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/userSchema.js')

//Connection
main()
.then((res)=>{
    console.log('Connection Succesfull');
})
.catch((err) =>{
    console.log(err)
});
async function main() {
await mongoose.connect(process.env.ATLAS_URL);
}

//MiddleWares
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public' )));
app.use(express.json());

 const store= MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto:{
      secret:process.env.SECRET,
     },
    touchAfter:24*3600
});
store.on("error",()=>{
console.log(err);
})
const sessionOption={
   store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,
   }
};




app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.error = req.flash('error');
    res.locals.currentUser=req.user;
   next();
})



app.get('/', (req, res) => {
   
res.redirect('/listings')
});


app.get('/privacy',(req,res)=>{
   res.render('FooterComps/privacy.ejs')
})


app.get('/terms',(req,res)=>{
     res.render('FooterComps/terms.ejs')
})
app.get('/contact',(req,res)=>{
   res.render('FooterComps/contact.ejs')
})

app.use('/',userRouter);

app.use('/listings',listingRouter);




app.use('/listings/:id/reviews',reviewsRouter);



app.use((req, res, next) => {
res.render('listings/err.ejs', { err });
});



app.use((err, req, res, next) => {
res.render('listings/err.ejs', { err })
});



app.listen(3000, () => {
   console.log('App listening on port');
});




