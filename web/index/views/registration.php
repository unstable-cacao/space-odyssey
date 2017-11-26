<html>
<head>

</head>
<body>
<form method="post" action="/registration">
	<h4>Required</h4>
	<label for="username">Username</label>
	<input type="text" name="username" id="username">
	<br>
	<label for="email">Email</label>
	<input type="email" name="email" id="email">
	<br>
	<label for="password">Password</label>
	<input type="password" name="password" id="password">
	<br>
	<label for="confirmPassword">Confirm Password</label>
	<input type="password" name="confirmPassword" id="confirmPassword">
	
	<hr>
	
	<h4>Optional</h4>
	<label for="fullname">Full Name</label>
	<input type="text" name="fullname" id="fullname">
	<br>
	<label for="dateOfBirth">Date of Birth</label>
	<input type="date" name="dateOfBirth" id="dateOfBirth">
	<br>
	<label for="sex">Sex</label>
	<input type="radio" name="sex" id="female" value="Female"> <label for="female">Female</label>
	<input type="radio" name="sex" id="male" value="Male"> <label for="male">Male</label>
	<br>
	<label for="thumbnail">Thumbnail</label>
	<input type="url" name="thumbnail" id="thumbnail">
	
	<hr>
	
	<br>
	<input type="submit">
</form>
</body>
</html>