const express = require('express');
const path = require('path');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const commentRoutes = require('./routes/commentRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/checkouts', checkoutRoutes);

// Serve HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/books.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'books.html')));
app.get('/bookDetails.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'bookDetails.html')));
app.get('/returnBooks.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'returnBooks.html')));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
