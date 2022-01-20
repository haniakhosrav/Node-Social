const express = require('express');

const router = express.Router();

//? Web Landing Page
//? GET /
router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home',
        path: '/'
    });
});

module.exports = router;