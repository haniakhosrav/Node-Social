const mongoose = require('mongoose');
const {postValidateSchema} = require('../models/secure/validateSchema');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 30
    },
    desc: {
        type: String,
        require: true,
        trim: true,
        minlength: 10,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

blogSchema.statics.postValidate = (body) => {
    return postValidateSchema.validate(body);
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;