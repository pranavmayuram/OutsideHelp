//var uuid 				= require("uuid");
var forge 				= require("node-forge");
var bucket				= require("../app").bucket;
var bucketName			= require("../config").couchbase.bucket;
var N1qlQuery 			= require('couchbase').N1qlQuery;
var Wunderground 		= require('wundergroundnode');
var myKey 				= '1e2197e4ea19a1aa';
var wunderground 		= new Wunderground(myKey)

function Weather() {};

Weather.receive = function(callback) {
	var weatherObj = {general: "Cloudzz", temp: "", wind: "", precip: "", feelsLike: "", humidity: ""};
	//var weatherObj.general, weatherObj.temp, weatherObj.wind, weatherObj.precip, weatherObj.feelsLike, weatherObj.humidity;
	//weatherObj.general= weatherObj.temp= weatherObj.wind= weatherObj.precip= weatherObj.feelsLike= weatherObj.humidity = "";

	var finished = false;
	var currentWeather ={};

	var assignWeather = function() {
		console.log(currentWeather);

		/*weatherObj.general = currentWeather.weather;							// ex: Partly Cloudy
		weatherObj.temp = currentWeather.temp_f;								// ex: 66.0
		weatherObj.wind = currentWeather.wind_mph;							// ex: 22.0
		weatherObj.precip = currentWeather.precip_1hr_in;						// ex: 0.00
		weatherObj.feelsLike = currentWeather.feelsslike_f;					// ex: 66.9			
		weatherObj.humidity = currentWeather.relative_humidity; 	*/			// ex: 65%			if over 80 say something, if below 30, say something

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
		callback(null, weatherObj);
	};

	wunderground.conditions().request('94121', function(err, response){
		if (err) {
			console.log(err);
			return;
		}
    	console.log(response.current_observation);
    	weatherObj.general = response.current_observation.weather;							// ex: Partly Cloudy
    	weatherObj.temp = response.current_observation.temp_f;								// ex: 66.0
    	weatherObj.wind = response.current_observation.wind_mph;							// ex: 22.0
    	weatherObj.precip = response.current_observation.precip_1hr_in;						// ex: 0.00
    	weatherObj.feelsLike = response.current_observation.feelsslike_f;					// ex: 66.9			
    	weatherObj.humidity = response.current_observation.relative_humidity; 				// ex: 65%			if over 80 say something, if below 30, say something
    	currentWeather = response.current_observation;
    	assignWeather();
	});
};

module.exports = Weather;

