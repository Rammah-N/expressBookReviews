const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	const userExists = isValid(username);
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Incomplete data, please provide all the fields" });
	}
	if (!userExists) {
		users.push({
			username,
			password,
		});
		return res
			.status(201)
			.json({ message: `User ${username} was created successfully` });
	}
	return res.status(400).json({
		message: "User exists already, please try a different username",
	});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(books);
		}, 1500);
	});
	promise.then((response) => {
		res.send(JSON.stringify(response, null, 4));
	});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	const { isbn } = req.params;
	const promise = new Promise((resolve, reject) => {
		if (books[isbn]) {
			resolve(books[isbn]);
		} else {
			reject("No book was found for this id");
		}
	});
	promise
		.then((response) => {
			return res.status(200).json(response);
		})
		.catch((err) => {
			return res.status(404).json({ message: err });
		});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const { author } = req.params;
	const keys = Object.keys(books);
	let book;
	for (let i = 0; i < keys.length; i++) {
		if (books[keys[i]].author === author) {
			book = books[keys[i]];
		}
	}
	const promise = new Promise((resolve, reject) => {
		if (book) {
			resolve(book);
		}
		reject("No book found for this id");
	});

	promise
		.then((response) => {
			return res.status(200).json(response);
		})
		.catch((err) => {
			return res.status(404).json({ message: err });
		});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const { title } = req.params;
	const keys = Object.keys(books);
	let book;
	for (let i = 0; i < keys.length; i++) {
		if (books[keys[i]].title === title) {
			book = books[keys[i]];
		}
	}
	const promise = new Promise((resolve, reject) => {
		if (book) {
			resolve(book);
		}
		reject("No book found for this id");
	});

	promise
		.then((response) => {
			return res.status(200).json(response);
		})
		.catch((err) => {
			return res.status(404).json({ message: err });
		});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const { isbn } = req.params;

	res.send(books[isbn].reviews);
});

module.exports.general = public_users;
