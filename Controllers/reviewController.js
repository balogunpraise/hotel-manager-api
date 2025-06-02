const Review = require('../Models/reviewModel'); 


exports.createReview = async(req, res) =>{
    try{
        const review = await Review(req.body)
        const savedReview = await review.save()
        res.status(201).json(
            {
             status:'success',
             message:'you have succesfully dropped a review to the manager',
             data:savedReview
        });
    }catch(err){
        res.status(400).json({error:err.message})
    }
}


exports.getAllReviews = async(req, res) =>{
    try{
        const reviews = await Review.find().populate('user').populate('booking');
        res.status(200).json({
            status:'success',
            message:'successfully fetched all reviews',
            data: reviews
        });
    }catch(err){
        res.status(500).json({error:err.message})
    }
}


exports.getReviewById = async(req, res) =>{
    try{
    const review = await Review.findById(req.params.id).populate('user').populate('booking');
    if(!review) return res.status(404).json({error: 'Review not found'});
    res.status(200).json({
        status:'success',
        message:'successfully fetched a review',
        data:review
    });
    }catch(err){
        res.status(500).json({error:err.message})
    }
}



exports.updateReview = async(req, res) =>{
    try{
        const { rating, comment, staffRating, cleanlinessRating, comfortRating, amenitiesRating } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if(!updatedReview){
            return res.status(404).json({error:'Review not found'})
        }
        res.status(200).json({
            status:'success',
            message:'review successfully updated',
            data:updatedReview
        });
    }catch(err){
        res.status(400).json({error:err.message})
    }
}


exports.deleteReview = async(req, res) =>{
    try{
    const deletedReview = await Review.findByIdAndDelete(req.params.id)
    res.status(200).json({
        message:'Review deleted successfully', 
        data:null
      })
    }catch(err){
        res.status(500).json({
            message:'Something went wrong',
            error:err.message
        })
    }
};