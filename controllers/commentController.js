const db = require('../models/db');

// Get comments for a book
exports.getComments = async (req, res) => {
    const { bookId } = req.params;
    try {
        const query = `
            SELECT c.id, c.comment, c.created_at, u.name AS user_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.book_id = ? ORDER BY c.created_at DESC
        `;
        const [comments] = await db.query(query, [bookId]);
        res.json(comments);
    } catch (error) {
        res.status(500).send('Error fetching comments');
    }
};

// Add a comment
exports.addComment = async (req, res) => {
    const { bookId } = req.params;
    const { userId, comment } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO comments (book_id, user_id, comment) VALUES (?, ?, ?)',
            [bookId, userId, comment]
        );
        res.status(201).json({ id: result.insertId, comment });
    } catch (error) {
        res.status(500).send('Error adding comment');
    }
};
