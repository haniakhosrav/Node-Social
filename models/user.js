const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {userValidateSchema} = require('./secure/validateSchema')


const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


userSchema.statics.userValidation = function(body) {
    return userValidateSchema.validate(body, {abortEarly: false});
}

userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) return;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err);
        user.password = hash;
        next();
    }); 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
