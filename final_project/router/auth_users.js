const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{
		username: "john",
		password: "1234",
	},
];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	const userExists = isValid(username);
	if (userExists) {
		const user = users.find((user) => user.username === username);
		if (user && user.password === password) {
			return true;
		}
	}
	return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(404).json({ message: "Incomplete fields" });
	}
	if (!authenticatedUser(username, password)) {
		return res.status(401).json({
			message: "Incorrect credentials, please check your information",
		});
	}
	let accessToken = jwt.sign(
		{
			data: { username, password },
		},
		"access",
		{ expiresIn: 60 * 60 }
	);
	req.session.authorization = {
		accessToken,
	};
	return res.status(200).send("Log in successful!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	const { review } = req.query;
	const { username } = req.user.data;
	const { isbn } = req.params;
	console.log(req.user);
	if (!isbn) {
		return res.status(404).json({ message: "Please provide a book ISBN" });
	}
	const book = books[isbn];

	if (!book) {
		return res.status(404).json({ message: "No book was found for that ID" });
	}

	if (!review) {
		return res.status(400).json({ message: "Please provide a review" });
	}

	book.reviews[username] = review;
	return res
		.status(201)
		.json({ message: `Your review for ${book.title} was added` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const { isbn } = req.params;
	const { username } = req.user.data;
	const book = books[isbn];

	if (!book.reviews[username]) {
		return res
			.status(404)
			.json({ message: "You don't have a review for this book!" });
	}
	delete books[isbn].reviews[username];
	return res
		.status(200)
		.json({ message: `Your review on ${book.title} was deleted successfully` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
