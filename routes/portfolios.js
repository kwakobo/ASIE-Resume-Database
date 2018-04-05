let models  = require('../models'),
	multer = require('multer'),
	express = require('express'),
	router  = express.Router();

let image_dir = "/portfolio/";

let portfolio_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/public/portfolio/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
});
let portfolio_upload = multer({ storage: portfolio_storage });

router.get('/:user_id', function(req, res) {
	models.Portfolio.findAll({
		where: {
			userId: req.params.user_id,
		},
		raw: true
	}).then((results) => {
		let portfolio = [];
		results.forEach((result) => {
			let portfolio_elem = {
				title: result.title,
				url: image_dir + result.url,
				thumbnail: image_dir + result.url,
				description: result.description
			};
			portfolio.push(portfolio_elem);
		})
		res.json(portfolio);
	});
})

router.post('/:user_id/update', portfolio_upload.single("image"), function(req, res) {
	let action = 'add';//req.body.action;
	let type = 'picture';//req.body.type;
	let url = req.file.filename;//req.body.url;
	let title = req.body.title;
	let thumbnail = req.file.filename;
	let description = req.body.description;

	if(action == "add") {
		models.Portfolio.create({
			userId: req.params.user_id,
			type: type,
			url: url,
			title: title,
			thumbnail: thumbnail,
			description: description
		}).then(results => {
			res.json({message: 'successful'})
		}).catch(error => {
			res.json(error)
		})
	}
	else {
		models.Portfolio.destroy({
			where: {
				userId: req.params.user_id,
				type: type,
				interest: interest
			}
		})
	}
});

module.exports = router;