const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

//Get all comments
router.get('/:bookId', commentController.getComments);

//Add comment
router.post('/:bookId', commentController.addComment);

module.exports = router;
