const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

//All books
router.get('/', bookController.getBooks);

// Get all available books
router.get('/available', bookController.getAvailableBooks);

// Get all unavailable books
router.get('/unavailable', bookController.getUnavailableBooks);

// Checkout
router.post('/checkout', bookController.checkoutBooks);

//Donate books
router.post('/donate', bookController.addDonatedBook);

//View Details
router.get('/:id', bookController.getBookDetails);

module.exports = router;
