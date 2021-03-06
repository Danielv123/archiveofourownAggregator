const assert = require("assert");
const ao3Tools = require("./ao3Tools");
const sinon = require("sinon");

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
	it("throws if there is no callback provided", done=>{
		assert.throws(()=>{
			ao3Tools.getChapterCount("11260185");
		});
		assert.throws(()=>{
			ao3Tools.getMetaData("http://archiveofourown.org/works/1100999/chapters/2214728");
		});
		done();
	});
	it("does not call callback if it recieves a request error", done=>{
		var callback = sinon.spy();
		ao3Tools.getMetaData("tp://archiveofourers/2214728", callback);
		// ao3Tools.getChapterCount("1http://www.google.com100", callback); // I have been unable to fake this one because I dunno how to invalidate this URL properly
		setTimeout(()=>{
			assert.equal(false, callback.called, "Invalid URLs should not call callback");
			done();
		},1900);
	});
});