import facets from '../models/facets';
import mongoose from 'mongoose';

let lookup = {}

lookup.find = function(req, res){
  let id = req.params.id;
  let results = []
  facets.forEach(function(item){
    if(item.id == id){
      results.push(item);
    }
  })
  res.json({'results':results});
}

export default lookup