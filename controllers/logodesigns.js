const Logodesign = require('../models/logodesign');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const logodesigns = await Logodesign.find({}).populate('popupText');
    res.render('logodesigns/index', { logodesigns })
}

module.exports.renderNewForm = (req, res) => {
    res.render('logodesigns/new');
}

module.exports.createLogodesign = async (req, res, next) => {
    const logodesign = new Logodesign(req.body.logodesign);
    logodesign.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    logodesign.author = req.user._id;
    await logodesign.save();
    console.log(logodesign);
    req.flash('success', 'Successfully made a new logodesign!');
    res.redirect(`/logodesigns/${logodesign._id}`)
}

module.exports.showLogodesign = async (req, res,) => {
    const logodesign = await Logodesign.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!logodesign) {
        req.flash('error', 'Cannot find that logodesign!');
        return res.redirect('/logodesigns');
    }
    res.render('logodesigns/show', { logodesign });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const logodesign = await Logodesign.findById(id)
    if (!logodesign) {
        req.flash('error', 'Cannot find that logodesign!');
        return res.redirect('/logodesigns');
    }
    res.render('logodesigns/edit', { logodesign });
}

module.exports.updateLogodesign = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const logodesign = await Logodesign.findByIdAndUpdate(id, { ...req.body.logodesign });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    logodesign.images.push(...imgs);
    await logodesign.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await logodesign.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated logodesign!');
    res.redirect(`/logodesigns/${logodesign._id}`)
}

module.exports.deleteLogodesign = async (req, res) => {
    const { id } = req.params;
    await Logodesign.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted logodesign')
    res.redirect('/logodesigns');
}