const express = require('express');

const {authenticate} = require('../middlewares/auth');
const {getDashboard, 
        getAddPost, 
        addPost} = require('../controllers/adminController');

const router = express.Router();

//? Dashboard
//? GET /dashboard
router.get('/', authenticate, getDashboard);

//? Add Post
//? GET /add-post
router.get('/add-post',authenticate, getAddPost);

//? Add Post
//? POST /add-post
router.post('/add-post',authenticate, addPost);

module.exports = router;