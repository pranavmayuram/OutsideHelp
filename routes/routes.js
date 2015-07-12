var User        = require("../models/usermodel");
var Admin     	= require("../models/adminmodel");
var Session     = require("../models/sessionmodel");
var Weather		= require("../models/weathermodel");
var uuid        = require("uuid");

var appRouter = function(app, io) {
	
	app.get('/api/getWeather', function(req, res) {
		Weather.receive(function(error, result) {
			if(error) {
                return res.status(400).send(error);
            }
            res.json(result);
		})
	});

	/* app.post('/api/insertUserInjury', function(req, res) {
		User.create(req.body, function(error, result) {
			if(error) {
				return res.status(400).send(error);
			}
			res.json(result);
		})
	}); */

	app.get('/', function(req, res) {
            console.log("getting to index.html"); // load the single view file (angular will handle the page changes on the front-end)
            res.sendfile('index.html');
    });
};

module.exports = appRouter;