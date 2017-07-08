import facets from '../models/facets';
import mongoose from 'mongoose';

let lookup = {}
let mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, (err, res)=>{
	if(err){
		console.log("error connecting to "+mongoUrl+": ", err);
	}else{
		console.log("success!: "+mongoUrl);
	}
});

let guestSchema = new mongoose.Schema({
	name:String,
	attending:Boolean,
	guests:Number,
	request:String,
	invite_id:String
});

let Guest = mongoose.model('guests', guestSchema);

Guest.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.', err);
  }
});

let demo = new Guest({
	name:"Ella Fitzgerald",
	attending:true,
	guests:2,
	request:"I wanna Dance With Somebody",
	invite_id:"01432"
});

demo.save( (err) => {
	if(err){
		console.log('error saving', err);
	}
});

lookup.find = function(req, res){
  let id = req.params.id;
  let results = []
  // facets.forEach(function(item){
  //   if(item.id == id){
  //     results.push(item);
  //   }
  // })
  let guest = Guest.findOne({"invite_id":id}, (err, result) => {
  	console.log('err: ', err, 'result: ', result);
  	if(result){
  		results.push(result);
  		res.json({'results':results});
  	}else{
  		results.push({'name':'none found'});
  		res.json({'results':results});
  	}
  });
}
lookup.update = function(req,res){
	let userData = req.body;
	let find = {'invite_id':userData.invite_id};
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