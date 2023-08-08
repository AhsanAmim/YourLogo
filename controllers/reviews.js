const Logodesign = require('../models/logodesign');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const logodesign = await Logodesign.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    logodesign.reviews.push(review);
    await review.save();
    await logodesign.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/logodesigns/${logodesign._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Logodesign.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/logodesigns/${id}`);
}
