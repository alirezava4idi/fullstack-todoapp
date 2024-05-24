const express = require('express');
const router = express.Router()

const routeControllers = require('../controllers/users.controllers');
const signupValidator = require('../validators/signup.validator');
const loginValidator = require('../validators/login.validator');


router.get('/signup', routeControllers.signup);
router.post('/signup', signupValidator, routeControllers.signup);
router.post('/checkUsername', routeControllers.isUsernameValid)
router.post('/login', loginValidator, routeControllers.login);
router.get('/login', routeControllers.login);


module.exports = router