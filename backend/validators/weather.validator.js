import Joi from 'joi';

export const currentWeatherSchema = Joi.object({
    zip: Joi.string().pattern(/^\d{5}$/).required(),
});

export const historicalWeatherSchema = Joi.object({
    zip: Joi.string().pattern(/^\d{5}$/).required(),
    start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});
