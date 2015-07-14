var User        = require("../models/usermodel");
var Admin     	= require("../models/adminmodel");
var Session     = require("../models/sessionmodel");
var Weather		= require("../models/weathermodel");
//var uuid        = require("uuid");

var appRouter = function(app, io) {
	
	app.get('/api/getWeather', function(req, res) {
		Weather.receive(function(error, result) {
			if(error) {
                return res.status(400).send(error);
            }
            res.json(result);
		});
	});

	app.post('/api/insertUserDoc', function(req, res) {
		User.create(req.body, function(error, result) {
			if(error) {
				return res.status(400).send(error);
			}
			res.json(result);
		});
	});

	app.get('/api/checkHelpOnWay', function(req, res) {
		User.checkHelp(req.query, function(error, result) {
			if(error) {
				return res.status(400).send(error);
			}
			res.json(result);
		});
	});

	app.get('/api/admin_loginAuth', function(req, res) {
		Admin.searchAdminsByEmail(req.query, function(err, result) {
			if(err) {
				return res.status(400).send(error);
			}
			if (result.length == 0) {
				return res.send(false);	
			}
			console.log(JSON.stringify(result));
			return res.send(Admin.validatePassword(req.query.password, result[0].OutsideHelp.password));
			/*else if(!Admin.validatePassword(req.query.password, result[0].OutsideHelp.password)) {
                return res.send({"status": "error", "message": "The password entered is invalid"});
            }
            else {
				return res.send({"status": "success", "message": "Welcome to OutsideHelp"});
			} */
		});
	});

	app.get('/api/admin_getAllUsers', function(req, res) {
		Admin.getAllUsers (function(err, result) {
			if(err) {
				return res.status(400).send(error);
			}
			else {
				for (i=0; i<result.length; i ++) {
					result[i].OutsideHelp.distance = Admin.calculateDistance(37.3992711, -122.10791359999999, 37.738888, -122.437464);
				}	// result[i].OutsideHelp.location.latitude, result[i].OutsideHelp.location.latitude
			}
			res.json(result);
		});
	});

	/*app.get('/api/admin_getAllUsers', function(req, res) {
		Admin.
	}); */

	app.get('/', function(req, res) {
            console.log("getting to index.html"); // load the single view file (angular will handle the page changes on the front-end)
            res.sendfile('index.html');
    });
};

module.exports = appRouter;