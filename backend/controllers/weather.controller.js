import catchAsync from '../utils/catchAsync.js';
import { getCurrentWeather, getHistoricalWeather } from '../services/weather.service.js';

export const getWeather = catchAsync(async (req, res) => {
    const { zip } = req.query;
    const data = await getCurrentWeather(zip);
    res.json(data);
});

export const getHistorical = catchAsync(async (req, res) => {
    const { zip, start_date, end_date } = req.query;
    const data = await getHistoricalWeather(zip, start_date, end_date);
    res.json(data);
});
