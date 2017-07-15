'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _facets = require('../models/facets');

var _facets2 = _interopRequireDefault(_facets);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lookup = {};
var mongoUrl = process.env.MONGODB_URI;

_mongoose2.default.connect(mongoUrl, function (err, res) {
	if (err) {
		console.log("error connecting to " + mongoUrl + ": ", err);
	} else {
		console.log("success!: " + mongoUrl);
	}
});

var guestSchema = new _mongoose2.default.Schema({
	name: String,
	attending: Boolean,
	guests: Number,
	request: String,
	invite_id: String
});

var Guest = _mongoose2.default.model('guests', guestSchema);

// Guest.remove({}, function(err) {
//   if (err) {
//     console.log ('error deleting old data.', err);
//   }else{
//   	console.log('deleted old daterz');
//   }
// });

// let demo = new Guest({
// 	name:"Ella Fitzgerald",
// 	attending:true,
// 	guests:2,
// 	request:"I wanna Dance With Somebody",
// 	invite_id:"01432"
// });

// let demo2 = new Guest({
// 	name:"Alison Levack",
// 	attending:true,
// 	guests:2,
// 	request:"Invisible Touch",
// 	invite_id:"01432"
// });
// demo2.save((err)=>{
// 	if(err){
// 		console.log('error saving 2', err);
// 	}
// });

// demo.save( (err) => {
// 	if(err){
// 		console.log('error saving', err);
// 	}
// });

lookup.find = function (req, res) {
	var id = req.params.id;
	var results = [];
	// find guests with invite ID of id
	var guest = Guest.find({ "invite_id": id }, function (err, result) {
		console.log('err: ', err, 'result: ', result);
		if (result) {
			// push results with that invite ID
			res.json({ 'results': result });
		} else {
			results.push({ 'name': 'none found' });
			res.json({ 'results': results });
		}
	});
};
lookup.update = function (req, res) {
	var userData = req.body;
	var find = { '_id': userData._id };
	Guest.update(find, userData, function (err, item) {
		console.log('updated: ', item, 'error? ', err);
		if (item) {
			res.json({ 'message': 'success' });
		} else {
			res.json({ 'message': 'error' });
		}
	});
};

exports.default = lookup;
//# sourceMappingURL=index.js.map