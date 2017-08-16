var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var json2xls = require("json2xls");
var xlsx = require('node-xlsx');







var config = {
	local: __dirname + "/upload/",
	localExcel: __dirname + "/excel/",
	remote: "Z:/upload/",
	remoteExcel: "Z:/excel/"

}














var speed = {

	createFile: function(filePath, next) {
		
		var run = true;
		var i = 1;
		var start = new Date();
		while(run) {
			var file = fs.writeFileSync(filePath + "test"+i, "speed");
			var end = (new Date() - start)/1000;
			if(end >= 60) {
				console.log(i + ' files created in ' + end + " seconds.");
				run = false;
			}
				++i;
		}
		return next();

	},
	createExcel: function(filePath, next) {
		var start = new Date();
		var json = {};

		for(var i = 0; i < 100;i++) {
			json[i] = Math.floor(Math.random() * 11);
		}

		var xls = json2xls(json);
		fs.writeFileSync(filePath+'data.xlsx', xls, 'binary')

		console.log("Single excel file created in - " + (new Date() - start)/1000 + " seconds.");
		return next();


	},
	readExcel: function(filePath, next) {
		var start = new Date();
		var obj = xlsx.parse(filePath + 'data.xlsx'); 
		
		console.log("Single excel file read time - " + (new Date() - start)/1000 + " seconds.");
		return next();


	}

	
}



async.waterfall([
	function(callback) {
		console.log("Starting to create local files");
		return speed.createFile(config.local,callback);
	}, function(callback) {
		
		return callback();
	}, function(callback) {
		console.log("\r\n-----------------------------\r\nStarting to create remote files");

		return speed.createFile(config.remote, callback);
	}, function(callback) {
		console.log("\r\n-----------------------------\r\nCreate local excel file");
		return speed.createExcel(config.localExcel, callback);

	}, function(callback) {
		console.log("\r\n-----------------------------\r\nRead local excel file.");
		return speed.readExcel(config.localExcel, callback);
	}, function(callback) {
		console.log("\r\n-----------------------------\r\nCreate remote excel file.");
		return speed.createExcel(config.remoteExcel, callback);
	}, function(callback) {
		console.log("\r\n-----------------------------\r\nRead remote excel file.");
		return speed.readExcel(config.remoteExcel, callback);
	}
], function() {
	console.log("\r\n-----------------------------\r\nProgram has finished, terminating");
});








