
window.onload = ()=>{
	// attach event listners
	document.querySelector("#submit").onclick = ()=>{
		// validate inputs
		let email = document.querySelector("#email").value;
		let name = document.querySelector("#name").value;
		let url = document.querySelector("#url").value;
		if(validateEmail(email) && validateName(name) && validateURL(url)){
			console.log("Sending request")
			// AJAX STUFF :D
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/api/subscribe", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			
			// send the collected data as JSON
			xhr.send(JSON.stringify({email:email,name:name,storyURL:url,type:"chapter"}));
			
			xhr.onloadend = function () {
				// done
			};
		}
	}
	document.querySelector("#email").onchange = ()=>{
		let emailField = document.querySelector("#email");
		if(!validateEmail(emailField.value)){
			emailField.style.borderColor = "red";
		} else {
			emailField.style.borderColor = "green";
		}
	}
	document.querySelector("#name").onchange = () => {
		let nameField = document.querySelector("#name");
		if(!validateName(nameField.value)){
			nameField.style.borderColor = "red";
		} else {
			nameField.style.borderColor = "green";
		}
	}
	document.querySelector("#url").onchange = () => {
		let urlField = document.querySelector("#url");
		if(!validateURL(urlField.value)){
			urlField.style.borderColor = "red";
		} else {
			urlField.style.borderColor = "green";
		}
	}
}

validateEmail = address => {
	return !!(address.includes("@") && address.includes("."));
}
validateName = name => {
	return !!(typeof name == "string" && name.length > 0 && !name.includes(">") && !name.includes("<"));
}
validateURL = url => {
	// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
	function isURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return pattern.test(str);
	}
	
	return isURL(url);
}
