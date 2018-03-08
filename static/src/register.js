$("#register").click(e => {
	var user = document.getElementById("user-name").value;
	var users={
		"name":document.getElementById("full-name").value,
		"user_name":document.getElementById("user-name").value,
		"password":document.getElementById("pass-word").value,
		"department":document.getElementById("department").value
	}
	
	if(users.user_name.length < 2) {
		alert("username must have at least 2 characters");
		return;
	}
	if(users.password.length < 6) {
		alert("password must have at least 6 characters");
		return;
	}
})
