const express = require('express');
const router=express.Router({mergeParams:true});
const warpAsync = require('../utils/warpAsync');
const reviewController=require('../controllers/reviewController')
const {isLoggedIn}=require('../middleware')



router.post('/',isLoggedIn,warpAsync(reviewController.reviewAdd))


router.delete('/:reviewId',reviewController.deleteReview)

module.exports=router;

