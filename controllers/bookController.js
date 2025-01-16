const db = require('../models/db');

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
};

// Get book details
exports.getBookDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [book] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
        if (book.length === 0) {
            return res.status(404).send('Book not found');
        }
        res.json(book[0]);
    } catch (error) {
        res.status(500).send('Error fetching book details');
    }
};    

// Get all available books
exports.getAvailableBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books WHERE status = "available"');
        res.json(books);
    } catch (error) {
        res.status(500).send('Error fetching available books');
    }
};

// Get all unavailable books (checked out or lost)
exports.getUnavailableBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books WHERE status IN ("checked_out", "lost")');
        res.json(books);
    } catch (error) {
        res.status(500).send('Error fetching unavailable books');
    }
};

// Checkout selected books
exports.checkoutBooks = async (req, res) => {
    const { userId, bookIds } = req.body;
    if (!userId || !Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        for (const bookId of bookIds) {
            // Update books table to mark as checked_out
            await db.query('UPDATE books SET status = "checked_out" WHERE id = ?', [bookId]);

            // Add entry to the checkout table
            await db.query('INSERT INTO checkouts (user_id, book_id) VALUES (?, ?)', [userId, bookId]);
        }

        res.status(200).json({ message: 'Books checked out successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error });
    }
};

//Donate books
exports.addDonatedBook = async (req, res) => {
    try {
        const { title, author, type } = req.body;

        // Validate required fields
        if (!title || !author) {
            return res.status(400).send('Title and Author are required.');
        }

        // Set type to "unknown" if not provided
        const bookType = type || 'unknown';

        // Insert book into the database
        const [result] = await db.query(
            'INSERT INTO books (title, author, category, status) VALUES (?, ?, ?, ?)',
            [title, author, bookType, 'available']
        );

        res.status(201).send({ message: 'Book donated successfully.', bookId: result.insertId });
    } catch (error) {
        console.error('Error donating book:', error); // Log the error for debugging
        res.status(500).send('Error donating book.');
    }
};
