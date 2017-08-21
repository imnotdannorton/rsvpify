require('dotenv').config();
import {} from 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import lookup from './lookup';

let app = express();
let fileopts =  {
  root: __dirname + '/public/',
  dotfiles: 'deny',
  headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
  }
};
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
app.use('/public', express.static( __dirname +'/public'));
// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));
	// api router
	app.use('/api', api({ config, db }));
  app.get('/find/:id', function(req, res){
    lookup.find(req, res);
  });
  app.get('/guests', function (req, res){
    lookup.fetchAll(req,res);
  });
  app.post('/update', function(req, res){
    lookup.update(req, res);
  });
  app.get('/', function (req, res) {
    res.sendFile('/views/home.html', fileopts);
  });
  app.get('/guestlist', function (req, res) {
    res.sendFile('/views/list.html', fileopts);
  });
	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
