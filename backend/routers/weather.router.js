import { Router } from 'express';
import validate from '../middlewares/validation.middleware.js';
import { currentWeatherSchema, historicalWeatherSchema } from '../validators/weather.validator.js';
import { getWeather, getHistorical } from '../controllers/weather.controller.js';

const router = Router();

router.get('/current', validate(currentWeatherSchema), getWeather);
router.get('/historical', validate(historicalWeatherSchema), getHistorical);

export default router;
