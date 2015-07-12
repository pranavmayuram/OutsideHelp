var uuid 				= require("uuid");
var forge 				= require("node-forge");
var bucket				= require("../app").bucket;
var bucketName			= require("../config").couchbase.bucket;
var N1qlQuery 			= require('couchbase').N1qlQuery;

function Weather() {};

Weather.receive = function(callback) {
	var weatherObj = {};
	wunderground.conditions().request('37.769457, -122.488599', function(err, response){
		if err {
			console.log(err);
			return;
		}
    	console.log(response);
    	weatherObj.general = response.current_obervations.weather;							// ex: Partly Cloudy
    	weatherObj.temp = response.current_observations.temp_f;								// ex: 66.0
    	weatherObj.wind = response.current_obervations.wind_mph;							// ex: 22.0
    	weatherObj.precip = response.current_obervations.precip_1hr_in;						// ex: 0.00
    	weatherObj.feelsLike = response.current_obervations.feelsslike_f;					// ex: 66.9			
    	weatherObj.humidity = response.current_obervations.relative_humidity;				// ex: 65%			if over 80 say something, if below 30, say something
	}
	if (weatherObj.feelsLike < 60 || weatherObj.temp < 60) {
		weatherObj.instructions = "It's cold outside! Many concert-goers come to Outside Lands summer clothes, please take a jacket or blanket.";
	}
	else if (weatherObj.humidity > "75%" ) {
		weatherObj.instructions = "It's humid outside! Concert-goers are more likely to get dehydrated, please take water.";
	}
	else if (weatherObj.temp > 80 || weatherObj.feelsLike > 80) {
		weatherObj.instructions = "It's hot outside! Concert-goers are more likely to get dehydrated, please take water.";
	}
	else if (weatherObj.wind >= 27) {
		weatherObj.instructions = "It's windy outside! Many concert-goers come to Outside Lands summer clothes, please take a wind jacket or blanket.";
	}
	else if (weatherObj.precip > 0.08) {
		weatherObj.instructions = "There is rainfall predicted in the next hour! Please take an umbrella to shield concert-goers and yourself.";
	}
	else {
		weatherObj.instructions = "The weather is looking good outside! Keep healthy, and keep yourself and concert-goers hydrated.";
	}
};

module.exports = Weather;

