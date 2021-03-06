const Joi = require('joi');

/**
 * Login Validator
 *
 * @type {{body: {username: *, password: *}}}
 */
const login = {
    body: {
        username: Joi.string()
            .min(5).max(20)
            .regex(/^[a-zA-Z][a-zA-Z0-9_.]*$/)
            .required(),

        password: Joi.string()
            .min(8).max(64)
            .required(),
    }
};

/**
 * Username uniqueness check validator
 *
 * @type {{body: {username: *}}}
 */
const usernameUniquenessCheck = {
    body: {
        username: Joi.string()
            .min(5).max(20)
            .regex(/^[a-zA-Z][a-zA-Z0-9_.]*$/)
            .required(),
    }
};

/**
 * Register Validator
 *
 * @type {{body: {username: *, password: *}}}
 */
const register = {
    body: {
        username: Joi.string()
            .min(5).max(20)
            .regex(/^[a-zA-Z][a-zA-Z0-9_.]*$/)
            .required(),

        password: Joi.string()
            .min(8).max(64)
            .required(),
    }
};

module.exports = {
    login,
    usernameUniquenessCheck,
    register,
};
