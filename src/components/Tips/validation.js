const validateUsername = (username) => {
	// const invalidUsernames = ['admin', 'root', 'username'];
	const hasInvalidChars = /[^a-zA-Z0-9]/.test(username); // Esempio di controllo per caratteri non alfanumerici
	return username && username.length >= 3 && username.length <= 15;
};

const validatePassword = (password, username) => {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	const doesNotContainUsername = !password.includes(username);
	return passwordRegex.test(password) && doesNotContainUsername;
};
