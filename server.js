
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
let books = [];
app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity } = req.body;
    if (
        id === undefined ||
        title === undefined ||
        author === undefined ||
        category === undefined ||
        quantity === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Book ID must be a positive integer"
        });
    }
    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof category !== "string" || !category.trim()
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            message: "Quantity must be a non-negative integer"
        });
    }

    // Check duplicate ID
    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(409).json({
            message: "Book with this ID already exists"
        });
    }

    // Create book
    const newBook = {
        id,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity,
        availability: quantity
    };
    books.push(newBook);
    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });

});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/api/books", (req, res) => {
    if (books.length === 0) {
        return res.status(200).json({
            message: "No books available",
            books: []
        });
    }
    res.status(200).json({
        message: "Books retrieved successfully",
        books: books
    });
});
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    res.status(200).json({
        message: "Book found successfully",
        book: book
    });
});


