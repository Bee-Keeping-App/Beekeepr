const Joi = require('joi');

/* note:
    I would consider moving these schemas out to a global config/constant folder
    so the frontend and backend can use the same ones.
*/

// 3-20 chars, alphanum + '.' and '-' allowed
const validUsername = Joi.string()
            .min(3)
            .max(20)
            .pattern(new RegExp(/^[a-zA-Z0-9-.]{3,20}$/));

// 8-30 chars, alphanumeric + special chars allowed
const validPassword = Joi.string()
            .min(8)
            .max(30)
            .pattern(new RegExp(/^[a-zA-Z0-9!@#$%^&*()?]{8,30}$/));

const validEmail = Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });

// phone regex borrowed from https://stackoverflow.com/a/50122731
const phoneRegex = new RegExp(/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/);

// accepts string or number, but coerces to string before checking against a regex
const validPhone = Joi.alternatives()
    .try(
        Joi.string(),
        Joi.number()
    ).custom((value, helpers) => {
        const str = String(value);

        if (!phoneRegex.test(str)) {
            return helpers.error('any.invalid');
        }

        return str;
    }, 'phone validation');

module.exports = {
    validUsername,
    validPassword,
    validEmail,
    validPhone
};