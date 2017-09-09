
global = {
	books:[],
	};

window.onload = ()=>{
	// attach event listners
	document.querySelector("#submit").onclick = ()=>{
		// validate inputs
		let email = document.querySelector("#email").value;
		let name = document.querySelector("#name").value;
		let url = document.querySelector("#url").value;
		if(validateEmail(email) && validateName(name) && validateURL(url)){
			console.log("Sending request")
			// AJAX STUFF
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "/api/subscribe", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			
			// send the collected data as JSON
			xhr.send(JSON.stringify({email:email,name:name,storyURL:url,type:"chapter"}));
			
			// show loading bar
			document.querySelector("#loading").style.display = "block";
			
			// process response
			xhr.onreadystatechange = function () {
				if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					
					if(xhr.responseText == "success"){
						console.log("Success, yay!");
						location.reload();
					} else {
						console.log(xhr.responseText);
						alert(xhr.responseText);
						location.reload();
					}
				}
			};
		}
	}
	document.querySelector("#email").onchange = ()=>{
		let emailField = document.querySelector("#email");
		handleEmailFieldChange(emailField);
	}
	document.querySelector("#name").onchange = () => {
		let nameField = document.querySelector("#name");
		handleNameFieldChange(nameField);
	}
	document.querySelector("#submit").disabled = true;
	document.querySelector("#url").onchange = () => {
		let urlField = document.querySelector("#url");
		if(!validateURL(urlField.value)){
			urlField.style.borderColor = "red";
			document.querySelector("#submit").disabled = true;
		} else {
			urlField.style.borderColor = "green";
			document.querySelector("#submit").disabled = false;
			if(urlField.value.includes("/chapters")){
				urlField.value = urlField.value.split("/chapters")[0];
			}
			
			// Check if book is already subscribed to, disable button and hilight if it is
			document.querySelectorAll(".url").forEach(url => {
				if(url.innerHTML.includes(urlField.value)){
					document.querySelector("#submit").disabled = true;
					urlField.style.borderColor = "red";
					url.parentElement.style.backgroundColor = "red";
					// alert("Book already subscribed to"); // no need for alert, we will just give visual cluses instead
				}
			});
		}
	}
	
	
	// get last values for name and email from localStorage
	if(localStorage.email) {
		let emailField = document.querySelector("#email");
		emailField.value = localStorage.email;
		handleEmailFieldChange(emailField);
	}
	if(localStorage.name) {
		let nameField = document.querySelector("#name");
		nameField.value = localStorage.name;
		handleNameFieldChange(nameField);
	}
}
handleEmailFieldChange = emailField => {
	if(!validateEmail(emailField.value)){
		emailField.style.borderColor = "red";
	} else {
		localStorage.email = emailField.value;
		
		emailField.style.borderColor = "green";
		$.ajax({
			type: "POST",
			data :JSON.stringify({"email":emailField.value}),
			url: "api/subscriptions",
			contentType: "application/json",
			success: data => {
				document.querySelector("#booksContainer").innerHTML = formatSubscriptions(JSON.parse(data));
				global.books = data;
			},
		});
	}
}
handleNameFieldChange = nameField => {
	if(!validateName(nameField.value)){
		nameField.style.borderColor = "red";
	} else {
		localStorage.name = nameField.value;
		
		nameField.style.borderColor = "green";
	}
}
formatSubscriptions = data => {
	let HTML = "<tr><td>URL</td><td>Title</td><td>Author</td><td>Chapters</td></tr>";
	data.forEach(book => {
		HTML += "<tr class='book'><td class='url'>"+book.url+"</td><td class='title'><a href='"+book.url+"'>"+book.title+"</a></td><td class='author'>"+book.author+"</td><td class='chapters'>Chapters: <span>"+book.chapterCount+"</span></td></tr>"
	});
	
	return HTML;
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
