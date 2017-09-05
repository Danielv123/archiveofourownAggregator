const request = require("request");
const assert = require("assert");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
		if(!err && html){
			/*let $ = cheerio.load(html);
			console.log($("#workskin > div.preface.group").length);
			let title = $(".title");
			console.log(title)
			let author = $("h3.byline.heading > a")[0].data;*/
			let dom = new JSDOM(html);
			const document = dom.window.document;
			
			// console.log(document.querySelector("p"));
			
			callback({title:"placeholderTitle", author:"placeholderAuthor"});
		}
	});
}

module.exports = {
	getChapterCount: getChapterCount,
	getMetaData: getMetaData,
}
