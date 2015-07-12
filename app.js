var couchbase 		= require('couchbase');
var express			= require('express');
var app 			= express();
var config 			= require("./config");
var bodyParser		= require('body-parser');
var methodOverride 	= require('method-override');
var morgan 			= require('morgan');
var multer  		= require('multer');
var fs 				= require('fs');

// use commands
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));
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
module.exports.userBucket = cluster.bucket(config.couchbase.bucket);

var routes = require("./routes/routes.js")(app);

// startup our app at http://localhost:3000
var port = process.env.PORT || config.couchbase.port;
app.listen(port);               

// inform user of IP                     
console.log('View Touchbase at localhost:' + config.couchbase.port);