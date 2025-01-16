const db = require('../models/db');

// Get books checked out by a user
exports.getCheckedOutBooks = async (req, res) => {
    const { userId } = req.params;

    try {
        const [books] = await db.query(
            `SELECT c.id AS checkoutId, b.id AS bookId, b.title, b.author, b.category, c.checkout_date 
             FROM checkouts c
             INNER JOIN books b ON c.book_id = b.id
             WHERE c.user_id = ? AND c.return_date IS NULL`,
            [userId]
        );
        res.json(books);
    } catch (error) {
        res.status(500).send('Error fetching checked-out books');
    }
};

// Return selected books
exports.returnBooks = async (req, res) => {
    const { checkoutIds } = req.body;

    try {
        await db.query(
            `UPDATE checkouts SET return_date = CURRENT_TIMESTAMP WHERE id IN (?)`,
            [checkoutIds]
        );

        await db.query(
            `UPDATE books SET status = 'available' WHERE id IN (
                SELECT book_id FROM checkouts WHERE id IN (?)
            )`,
            [checkoutIds]
        );

        res.send('Books returned successfully');
    } catch (error) {
        res.status(500).send('Error returning books');
    }
};
