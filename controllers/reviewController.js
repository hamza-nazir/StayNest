const { reviewSchema } = require('../joi');
const Listings = require('../models/listingSchema');
const Review = require('../models/reviewSchema');


module.exports.reviewAdd=async (req,res)=>{
let result=reviewSchema.validate(req.body);
if(result.error){
   res.send('Error')
}else{
let listing=await Listings.findById(req.params.id);
let reviews=new Review(req.body.review);
reviews.author=req.user._id;
listing.reviews.push(reviews);
await reviews.save();
await listing.save();
req.flash("success","Review Add Successfully, Thanks");
res.redirect(`/listings/${req.params.id}`);
}};

module.exports.deleteReview=async (req,res)=>{
let{id,reviewId}=req.params;

await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

await Review.findByIdAndDelete(reviewId);
req.flash("success","Review Deleted Successfully");
res.redirect(`/listings/${id}`)
}