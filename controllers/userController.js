const db = require('../models/db');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.query('INSERT INTO users (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).send('Error adding user');
    }
};
