var couchbase 		= require('couchbase');
var express			= require('express');
var app 			= express();
var config 			= require("./config");
var bodyParser		= require('body-parser');
var methodOverride 	= require('method-override');
var morgan 			= require('morgan');
var multer  		= require('multer');
var fs 				= require('fs');
var port 			= process.env.PORT || config.couchbase.port;
var server 			= app.listen(port); 
var io 				= require('socket.io').listen(server);

// use commands
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));
app.use(multer({dest: './uploads/', 
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  done=true;
	},
	limits: {
	  fieldNameSize: 100,
	  fileSize: 3000000,
	  files: 1,
	  fields: 5
	}
}));

var cluster = new couchbase.Cluster(config.couchbase.server);
module.exports.bucket = cluster.openBucket(config.couchbase.bucket);

var routes = require("./routes/routes.js")(app);

var User        = require("../models/usermodel");
var Admin     	= require("../models/adminmodel");
var Session     = require("../models/sessionmodel");
var Weather		= require("../models/weathermodel");

io.on('connection', function(socket){
		console.log('a user connected: '+ socket.id);
		socket.on('disconnect', function(){
			console.log( socket.id + ' has disconnected.' + socket.id)
		});

	});

io.on('User to Back', function(form){
	var id = form.id;
	var stuff = form.data;
	User.create(stuff, id, function(error, result) {
		if(error) {
			return res.status(400).send(error);
		}
		res.json(result);
	})
	console.log('Created user')
});

// startup our app at http://localhost:3000              

// inform user of IP                     
console.log('View Touchbase at localhost:' + config.couchbase.port);