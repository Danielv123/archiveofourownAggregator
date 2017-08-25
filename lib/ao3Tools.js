const request = require("request");
const assert = require("assert");
const cheerio = require("cheerio");

function getChapterCount(storyID, callback){
	if(typeof callback != "function") throw "callback not a function";
	request("https://archiveofourown.org/works/"+storyID+"/navigate", function(error, response, html){
		if(!error){
			let $ = cheerio.load(html);
			let numberOfChapters = $(".chapter.index.group li").length;
			assert.equal(typeof numberOfChapters, "number");
			
			callback(numberOfChapters);
		}
	});
}
function getMetaData(storyURL, callback){
	if(typeof callback != "function") throw "callback not a function";
	request(storyURL, function(err,res,html){
		if(!err){
			let $ = cheerio.load(html);
			let title = $("div.header.module > h4.heading a")[0].children[0].data;
			let author = $("div.header.module > h4.heading a")[1].children[0].data;
			
			callback({title:title, author:author});
		}
	});
}

module.exports = {
	getChapterCount: getChapterCount,
	getMetaData: getMetaData,
}
