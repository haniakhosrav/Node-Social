const passport = require('passport');
const {Strategy} = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

passport.use(new Strategy({usernameField: 'email'}, async(email, password, done) => {
    try {
        const user = await User.findOne({email});
        if(!user) return done(null, false, {message: 'there is no account with this email'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) return done(null, user);
        return done(null, false, {message: 'email or password is incorrect'});
    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});