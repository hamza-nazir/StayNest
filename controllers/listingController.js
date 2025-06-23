const Listings=require('../models/listingSchema');
const Review = require('../models/reviewSchema');
const { listingSchema } = require('../joi');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index=async (req, res) => {
const allListings = await Listings.find({})
res.render('listings/index.ejs', { allListings })
}


module.exports.renderNewForm= (req, res) => {
res.render('listings/new.ejs')
}


module.exports.createListingPost = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.Listings.location,
    limit: 1
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListings = new Listings(req.body.Listings);
  newListings.owner = req.user._id;
  newListings.image = { url, filename };

 
  newListings.geometry = response.body.features[0].geometry;

  let savedListing = await newListings.save();


  req.flash("success", "New Listing Created!");
  res.redirect('/listings');
}





module.exports.editRenderForm=async (req, res) => {
   let { id } = req.params;
   if (!id) {
      res.render('listings/invalidID.ejs')
   } else {
      let data = await Listings.findById(id);
      res.render('listings/edit.ejs', { data })
}};


module.exports.showDetails=async (req, res) => {
   
   let { id } = req.params;
 let data = await Listings.findById(id).populate('reviews').populate("owner")

 let reviewData = await Review.find({}).populate('author')
   if (!data) {
req.flash("failure","Listing Not Exist!");
        res.redirect('/listings')
   } else {
      res.render('listings/show.ejs', { data,reviewData })

}

};


module.exports.editPutForm=async (req, res) => {
   console.log("Ok");
let {id}=req.params;
let result=listingSchema.validate(req.body);
   if(result.error){
      res.send('Error')
   }else{

await Listings.findById(id); 
    
let listing=await Listings.findOneAndUpdate({_id:id}, { ...req.body.Listings })
if(typeof req.file!=='undefined'){
let url= req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save(); 
}
req.flash("success","Listing Edit Successfully");
res.redirect(`/listings/${id}`)
}};


module.exports.deleteForm=async (req, res) => {
   let { id } = req.params;
  if (!id) {
      res.render('listings/invalidID.ejs')
   } else {
      await Listings.findByIdAndDelete(id);
      req.flash("success","Listing Deleted");
      res.redirect('/listings')
}}