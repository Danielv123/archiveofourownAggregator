const assert = require("assert");
const request = require("request");
const cheerio = require("cheerio");


const server = require("./index");
const settings = require("./settings");

describe("index.js",x=>{
	it("opens a webserver that listens to settings.port", done=>{
		request("http://localhost:"+settings.port, function(err,res,html){
			assert.ok(html, "We got at least something back, right?");
			assert.equal(typeof html, "string");
			done();
		});
	});
	it("webpage root sends a static webpage with some html on it", done=>{
		request("http://localhost:"+settings.port, function(err, res, html){
			assert(!err);
			let $ = cheerio.load(html);
			let title = $("#container > h1").text();
			
			
			assert.equal(typeof title, "string");
			assert.equal(title, "Achive Of Our Own chapter notifier");
			
			done();
		});
	});
	it("// saves the database when it recieves SIGINT", done=>{
		done();
	});
});
