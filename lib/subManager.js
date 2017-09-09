const mkdirp = require("mkdirp");
const fs = require("fs");
const urlparser = require("urlparser");
const cheerio = require("cheerio");
const needle = require("needle");
const request = require("request");
const assert = require("assert");
const isEmail = require("is-email");
const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");


// Internal functions
const isJson = require("./isJson");
const ao3Tools = require("./ao3Tools");
const settings = require("./../settings")
// init code
if(!fs.existsSync(settings.databaseDirectory + settings.databaseName)){
	createDatabaseSync(settings.databaseDirectory, settings.databaseName);
}
console.log("Loading database...");
console.time("DBload")
const database = loadDatabaseSync(settings.databaseDirectory + settings.databaseName);
if(!database.archiveofourown) database.archiveofourown = [];
console.timeEnd("DBload");
console.log("Loaded database: "+settings.databaseName +" with "+database.archiveofourown.length + " entries.");

/* Check for new chapters */
function checkForUpdates(){
	saveSync();
	console.log("Checking for chapter updates in "+database.archiveofourown.length+" stories");
	function updateChecker(data){
		let path = urlparser.parse(data.url).path.base.split("/");
		ao3Tools.getChapterCount(path[1], numberOfChapters => {
			if(numberOfChapters > 0 && numberOfChapters > data.chapterCount){
				data.chapterCount = numberOfChapters;
				handleNewChapterFound(data);
			}
		});
	}
	for(let i = 0; i < database.archiveofourown.length; i++){
		setTimeout(()=>updateChecker(database.archiveofourown[i]),i*1000);
	}
}
setInterval(checkForUpdates, 1000*60*60*12); // check for updates every 12 hours
checkForUpdates();
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: settings.emailAddress,
		pass: settings.emailPassword,
	}
});

function handleNewChapterFound(data){
	console.log("Found new chapter "+data.chapterCount+" in: "+data.title);
	transporter.sendMail({
		from: settings.emailAddress,
		to: data.email,
		subject: 'ArchiveOfOurOwn story updated: '+data.title+" chapter "+data.chapterCount,
		html: "<p>Hi "+data.name+". You are recieving this email because you subscribed to changes in <a href='"+data.url+"'>"+data.title+"</a></p>\
			<p>For full data:</p><p>"+JSON.stringify(data)+"</p>",
	}, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

/* Database operations */
function createDatabaseSync(directory, name){
	mkdirp.sync(directory);
	// create empty database
	fs.writeFileSync(directory+name, JSON.stringify({}));
}
function loadDatabaseSync(directory){
	// "path/to/database.json"
	if(fs.existsSync(directory) && fs.statSync(directory).isFile()){
		let database = fs.readFileSync(directory);
		return JSON.parse(database);
	}
}
function saveDatabaseSync(directory, database){
	// "path/to/database.json", {}
	if(isJson(database) && fs.existsSync(directory) && fs.statSync(directory).isFile()){
		fs.writeFileSync(directory, JSON.stringify(database));
		console.log("Saved database with "+database.archiveofourown.length+" entries");
	}
}

/* Interfacing functions */
function add(userdata, callback2){
	/*
	{
		email:x@x.com,
		name:Daniel,
		storyURL:https://archiveofourown.org/works/11260185/chapters/25175877,
		type:chapter
	}
	*/
	let url = urlparser.parse(userdata.storyURL);
	//let url = urlparser.parse("https://archiveofourown.org/works/11260185/chapters/25175877");
	if(url.host.hostname == "archiveofourown.org"){
		console.log(JSON.stringify(url));
		// works/11260185/chapters/25175877
		let path = url.path.base.split("/");
		if(path[0] != "works" || isNaN(path[1])) return false;
		if(!isEmail(userdata.email)) return false;
		
		let databaseEntry = {};
		databaseEntry.timestamp = Date.now();
		databaseEntry.email = userdata.email;
		databaseEntry.username = userdata.name;
		databaseEntry.type = userdata.type;
		databaseEntry.url = userdata.storyURL;
		
		// get number of chapters and other story information
		ao3Tools.getChapterCount(path[1], numberOfChapters => {
			databaseEntry.chapterCount = numberOfChapters;
			callback(databaseEntry);
		});
		ao3Tools.getMetaData(databaseEntry.url, data => {
			databaseEntry.title = data.title;
			databaseEntry.author = data.author;
			callback(databaseEntry);
		});
		let i = 0;
		function callback(databaseEntry){
			i++;
			console.log("Callback "+i+" out of 2")
			if(i >= 2){
				// push info to database
				database.archiveofourown.push(databaseEntry);
				console.log("Person just subscribed to: ");
				console.log(databaseEntry);
				transporter.sendMail({
					from: settings.emailAddress,
					to: databaseEntry.email,
					subject: 'ArchiveOfOurOwn subscribtion confirmed: '+databaseEntry.title,
					html: "<p>Hi "+databaseEntry.username+". You are recieving this email because you subscribed to changes in <a href='"+databaseEntry.url+"'>"+databaseEntry.title+"</a></p>\
						<p>For full data:</p><p>"+JSON.stringify(databaseEntry)+"</p>",
				}, function(error, info){
					if (error) {
						console.log(error);
						callback2("failed, "+error);
					} else {
						console.log('Email sent: ' + info.response);
						callback2("success");
						saveDatabaseSync();
					}
				});
				// handleNewChapterFound(databaseEntry);
				// console.log(database.archiveofourown);
			}
		}
	}
}
function getSubs(user, callback){
	// callback(err,subs)
	// user.email is an email
	callback(undefined, database.archiveofourown.filter(entry => entry.email === user.email));
}
function saveSync(){
	saveDatabaseSync(settings.databaseDirectory + settings.databaseName);
}
process.on('SIGINT', function () {
	fs.writeFileSync(settings.databaseDirectory + settings.databaseName, JSON.stringify(database));
	console.log("Saved database!")
	process.exit(2);
});

module.exports = {
	add:add,
	saveSync:saveSync,
	forceChapterCheck: checkForUpdates,
	getSubscriptions:getSubs,
}