const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);

router.get('/', userController.authenticate, userController.getUsers)

router.put('/:id', userController.authenticate, userController.updateUser)

router.delete('/:id', userController.authenticate, userController.deleteUser)


module.exports = router;