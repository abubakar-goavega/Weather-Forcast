import { WeatherService } from "./services.js";
const API_KEY = "71f03e740fd8efc745f7f544c0baa923";
const weatherService = new WeatherService(API_KEY);
let geocoding = weatherService.getLatLonByCityName("londan", "http://api.openweathermap.org/geo/1.0/direct", 1);
geocoding.then((value) => {
    console.log(weatherService.getWeatherData(`https://api.openweathermap.org/data/2.5/forecast?lat=${value === null || value === void 0 ? void 0 : value.lat}&lon=${value === null || value === void 0 ? void 0 : value.lon}`));
});
