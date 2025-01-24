const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

//Get checkedout books
router.get('/user/:userId', checkoutController.getCheckedOutBooks);

//Return books
router.post('/return', checkoutController.returnBooks);

//Report Lost books
router.post('/lost', checkoutController.reportLostBooks);


module.exports = router;
