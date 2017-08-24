const assert = require("assert");
const ao3Tools = require("./ao3Tools");

describe("lib/ao3Tools.js", function(){
	it("gets story titles and author names", function(done){
		
		ao3Tools.getMetaData("https://archiveofourown.org/works/11260185/chapters/25175877", data => {
			assert.equal(data.title, "The Wonder of Ignorance");
			assert.equal(data.author, "FourCornersHolmes");
			callback();
		});
		ao3Tools.getMetaData("http://archiveofourown.org/works/1100999/chapters/2214728", data => {
			assert.equal(data.title, "Let the Games Begin");
			assert.equal(data.author, "psiten");
			callback();
		});
		let i = 0;
		function callback(){
			i++;
			if(i == 2){
				done();
			}
		}
	});
	it("gets the current chapter count", done=>{
		ao3Tools.getChapterCount("11260185", numberOfChapters => {
			assert.equal(numberOfChapters, 4);
			callback();
		});
		ao3Tools.getChapterCount("1100999", numberOfChapters => {
			assert.equal(numberOfChapters, 14);
			callback();
		});
		
		let i = 0;
		function callback(){
			i++;
			if(i == 2){
				done();
			}
		}
	});
});