const { body } = require('express-validator');

exports.validateUserRegistration = [
  body('username').notEmpty().withMessage('Username must be at least 5 characters long'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 8 characters long'),
];

exports.validateTaskCreation = [
    body('userId').notEmpty().withMessage('userId undefined'),
    body('taskName').notEmpty().withMessage('Task Name is Missing'),
    body('details').notEmpty().withMessage('Details is Missing'),
    body('priority').notEmpty().withMessage('Priority Not Selected'),
    body('status').notEmpty().withMessage('Status is missing')
]

exports.validateLogin = [
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required')
]
