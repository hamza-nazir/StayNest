const express = require('express');
const router=express.Router({mergeParams:true});
const warpAsync = require('../utils/warpAsync');
const {isLoggedIn}=require('../middleware')
const listingController=require('../controllers/listingController');
const{storage}=require('../cloudConfig')
const multer  = require('multer')
const upload = multer({ storage })

router.route('/')
.get(listingController.index )

.post(isLoggedIn,upload.single("Listings[image]"),warpAsync( listingController.createListingPost))


router.get('/new',isLoggedIn,listingController.renderNewForm)


router.route('/:id')
.get( warpAsync(listingController.showDetails))

.put(isLoggedIn,upload.single("Listings[image]"),warpAsync( listingController.editPutForm))


.delete(isLoggedIn, warpAsync(listingController.deleteForm))




router.get('/:id/edit',isLoggedIn, warpAsync(listingController.editRenderForm))


module.exports=router;