const Yup = require('yup');

const userValidateSchema = Yup.object().shape({
    fullname: Yup.string().required("Name field can't be empty")
    .min(4, "Name can't be less than 4 characters")
    .max(30, "Name can't be more than 30 characters"),
    email: Yup.string()
    .email("Email is not valid")
    .required("Email field can't be empty"),
    password: Yup.string()
    .required("password field can't be empty")
    .min(8, "password can't be less than 8 characters")
    .max(30, "password can't be more than 30 characters"),
    confirmPassword: Yup.string()
    .required("confirmPassword field can't be empty")
    .oneOf([Yup.ref('password'), null], 'confirm password must be same as password')
});

const postValidateSchema = Yup.object().shape({
    title: Yup.string().required("Title field can't be empty")
    .min(4, "title can't be less than 4 characters")
    .max(30, "title can't be more than 30 characters"),
    desc: Yup.string().required("Caption field can't be empty")
    .min(10, "Caption can't be less than 10 characters"),
    status: Yup.string(),
})

module.exports = {
    userValidateSchema,
    postValidateSchema
}