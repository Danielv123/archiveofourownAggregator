var epub = require('quick-epub');
var express = require("express");
// Required for express post requests
var bodyParser = require("body-parser");
var app = express();

// dependencies within the project
var subManager = require("./lib/subManager.js");

app.use(express.static('books'));
app.use(express.static('static'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

app.post("/api/subscribe", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(req.body);
	/*
	{
		email:x@x.com,
		name:Daniel,
		storyURL:https://archiveofourown.org/works/11260185/chapters/25175877,
		type:chapter
	}
	*/
	let x = req.body;
	subManager.add({email:x.email, name:x.name, storyURL:x.storyURL, type:x.type})
});
// testing
/*
subManager.add({
	email:"danielv@live.no",
	name:"Daniel",
	storyURL:"https://archiveofourown.org/works/11260185/chapters/25175877",
	type:"chapter"
});*/

var server = app.listen(80, function () {
	console.log("Listening on port %s...", server.address().port);
});

// save database
process.on('SIGINT', function () {
	console.log('### Saving databases and exiting ###');
	subManager.saveSync();
	process.exit(2);
});