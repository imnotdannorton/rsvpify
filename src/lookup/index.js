import facets from '../models/facets';
import mongoose from 'mongoose';
let guests = require('../models/list.json');
// console.log(guests);
let lookup = {}
let mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, (err, res)=>{
	if(err){
		console.log("mongo error connecting to "+mongoUrl+": ", err);
	}else{
		console.log("success!: "+mongoUrl);
	}
});

let guestSchema = new mongoose.Schema({
	name:String,
	attending:Boolean,
	guests:Number,
	request:String,
	responded:Boolean,
	invite_id:String
});

let Guest = mongoose.model('guests', guestSchema);


// Guest.remove({}, function(err) {
//   if (err) {
//     console.log ('error deleting old data.', err);
//   }else{
//   	console.log('deleted old daterz');
//   }
// });

// guests["guests"].forEach(function(guest){
// 	let insert = new Guest({
// 		name:guest.name,
// 		attending:true,
// 		guests:1,
// 		request:"",
// 		responded:false,
// 		invite_id:guest.invite_id
// 	});
// 	insert.save((err)=>{
// 		if(err){
// 			console.log("err saving", guest.name)
// 		}
// 	}); 
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

lookup.find = function(req, res){
  let id = req.params.id;
  let results = []
  // find guests with invite ID of id
  let guest = Guest.find({"invite_id":id}, (err, result) => {
  	console.log('err: ', err, 'result: ', result);
  	if(result){
  		// push results with that invite ID
  		res.json({'results':result});
  	}else{
  		results.push({'name':'none found'});
  		res.json({'results':results});
  	}
  });
}
lookup.fetchAll = function(req, res){
	let guests = Guest.find({'name':{$ne: null}}, (err, result) => {
		if(result){
			res.json({'results':result});
		}else{
			results.push({'name':'none found'});
  		res.json({'results':results});
		}
	});
}
lookup.update = function(req,res){
	let userData = req.body;
	let find = {'_id':userData._id};
	Guest.update(find, userData, (err, item) => {
		console.log('updated: ', item, 'error? ', err);
		if(item){
			res.json({'message':'success'});
		}else{
			res.json({'message':'error'});
		}
	}); 	
}

export default lookup