$("#register").click(e => {
	var registerInfo ={
		"name":document.getElementById("full-name").value,
		"username":document.getElementById("user-name").value,
		"password":document.getElementById("pass-word").value,
		"department":document.getElementById("department").value
	}
	
	if(registerInfo.username.length < 2) {
		alert("username must have at least 2 characters");
		return;
	}
	if(registerInfo.password.length < 6) {
		alert("password must have at least 6 characters");
		return;
	}

	$.ajax({
		url: "/register",
		method: 'POST',
		data: registerInfo
	}).done(() => {
		window.localStorage.username=registerInfo.username
		window.location.href = "/login"
	}).fail(err => {
		if (err.status === 409) {
			alert(err.responseText)
			window.location.reload()
		}
	})
})
