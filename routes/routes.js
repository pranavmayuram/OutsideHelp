var User        = require("../models/usermodel");
var Admin     	= require("../models/adminmodel");
var Session     = require("../models/sessionmodel");
var uuid        = require("uuid");

var appRouter = function(app) {

	app.get('/', function(req, res) {
            console.log("getting to index.html"); // load the single view file (angular will handle the page changes on the front-end)
            res.sendfile('index.html');
    });
};

module.exports = appRouter;