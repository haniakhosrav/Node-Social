const express = require('express');

const {userLogin, 
    userRegister, 
    createUser,
    handleLogin,
    handleLogout,
    rememberMe} = require('../controllers/user');

const {authenticate} = require('../middlewares/auth');

const router = express.Router();


//? Login Page
//? GET /users/login
router.get('/login', userLogin);

//? Handle Login
//? POST /users/login
router.post('/login', handleLogin, rememberMe);

//? Register Page
//? GET /users/register
router.get('/register', userRegister);

//? Register Page
//? POST /users/register
router.post('/register', createUser);

//? Handle Logout
//? GET /users/logout
router.get('/logout',authenticate, handleLogout);

module.exports = router;