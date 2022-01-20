const Blog = require('../models/blog');
const { formatDate } = require('../utils/jalali');
const {get500} = require('./errorController');

exports.getDashboard = async (req, res) => {
    try {
        const posts = await Blog.find({user: req.user.id});
        res.render('private/blogs', {
        pageTitle: 'dashboard',
        path: '/dashboard',
        layout: './layouts/dashLayout',
        fullname: req.user.fullname,
        posts,
        formatDate
    });
    } catch (err) {
        get500(req, res);
    }
}

exports.getAddPost = (req, res) => {
    res.render('private/addPost', {
        layout: './layouts/dashLayout',
        path: '/dashboard/add-post',
        pageTitle: 'add new post',
        fullname: req.user.fullname
    })
}

exports.addPost = async (req, res) => {
    const errors = [];
    const {title, desc, status} = req.body;
    try {
        await Blog.postValidate(req.body);
        await Blog.create({...req.body, user: req.user.id});
        res.redirect('/dashboard');
    } catch (err) {
        res.render('private/addPost', {
            pageTitle: 'add new post',
            path: '/dashboard/add-post',
            layout: './layouts/dashLayout',
            fullname: req.user.fullname,
            errors: err.errors
        });
        console.log(err.errors);
    }
}