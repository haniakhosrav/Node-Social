//const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');

const User = require('../models/user');

exports.userLogin = (req, res) => {
    if(req.isAuthenticated()) return res.redirect('/dashboard');
    res.render('login', {
        pageTitle: 'login',
        path: '/login',
        message: req.flash('success_msg'),
        error: req.flash('error')
    });
}

exports.handleLogin = async (req, res, next) => {
    if(!req.body['g-recaptcha-response']){
        req.flash('error', 'recaptcha validation is necessary');
        return res.redirect('/users/login');
    }
 
    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    const response = await axios.post(verifyUrl, {
        headers: {
            Accept: 'aplication/json',
            'Content-Type': 'x-www-form-urlencoded; charset=utf-8'
        }
    });
    // console.log(response.data)
    // console.log(req.connection.remoteAddress);
    
    if(response.data.success) {
        passport.authenticate('local', {
            //successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true,
        })(req, res, next)
    } else {
        req.flash('error', 'there is a problem in recaptcha validation');
        res.redirect('/users/login');
    } 
}

exports.rememberMe = (req, res) => {
    if(req.body.remember) req.session.cookie.originalMaxAge = 24 * 6 * 6 * 1000;
    else req.session.cookie.expires = null;
    res.redirect('/dashboard');
}

exports.handleLogout = (req, res) => {
    req.session = null;
    req.logout();
    // req.flash('success_msg', "you're successfuly loged out");
    res.redirect('/users/login');
}

exports.userRegister = (req, res) => {
    res.render('register', {
        pageTitle: 'register',
        path: '/register',
    });
}

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const {fullname, email, password} = req.body;
        const user = await User.findOne({email});
        if(user) {
            errors.push({message: 'there is an account with this email'})
            return res.render('register', {
                pageTitle: 'register',
                path: '/register',
                errors
            })
        } 
            //const hash = await bcrypt.hash(password, 10);
            await User.create({fullname, email, password});
            req.flash('success_msg', 'your account successfuly created');
            res.redirect('/users/login');
    } catch (err) {
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message,
            })
        })
        console.log(err.inner)
        return res.render('register', {
            pageTitle: 'register',
            path: '/register',
            errors
        })
    }
}

