const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Get user
router.get('/', userController.getUsers);

//Add user
router.post('/', userController.addUser);

module.exports = router;
