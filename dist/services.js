var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Geocoding {
    constructor(_apiKey) {
        this._apiKey = _apiKey;
        this.baseUrl = "https://api.openweathermap.org/geo/1.0/direct";
    }
    get getBaseUrl() {
        return this.baseUrl;
    }
    set setBaseUrl(url) {
        this.baseUrl = url;
    }
    urlBuilder(cityDetails, limit) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('q', cityDetails);
        url.searchParams.append('limit', limit + '');
        url.searchParams.append('appid', this._apiKey);
        return url;
    }
    validateCity(cityDetails) {
        if (cityDetails.length === 0)
            throw new Error("Provide City Name");
        if (cityDetails.length <= 3)
            throw new Error("Provide Proper City Name");
    }
    getCoordinates(cityDetails_1) {
        return __awaiter(this, arguments, void 0, function* (cityDetails, limit = 1) {
            this.validateCity(cityDetails);
            const url = this.urlBuilder(cityDetails, limit);
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error(`Http error! status: ${response.status}`);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error(`Error fetching corrdinates:`, error);
                throw error;
            }
        });
    }
}
export class WeatherService {
    constructor(_apiKey) {
        this._apiKey = _apiKey;
        this.baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
    }
    get getBaseUrl() {
        return this.baseUrl;
    }
    set setBaseUrl(url) {
        this.baseUrl = url;
    }
    urlBuilder(coord) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('lat', coord.lat + '');
        url.searchParams.append('lon', coord.lon + '');
        url.searchParams.append('appid', this._apiKey);
        url.searchParams.append('units', 'metric');
        return url;
    }
    getFilterFiveDaysWeatherForcast(list) {
        const foreCast = [];
        let index = 0;
        const noOfDays = 5;
        const hoursIntervalOfFiveDays = 8;
        for (let i = 0; i < noOfDays; i++) {
            foreCast.push(list[index]);
            index += hoursIntervalOfFiveDays;
        }
        foreCast.push(list[index - 1]);
        return foreCast;
    }
    getWeatherData(coord) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.urlBuilder(coord);
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error(`Http error! status: ${response.status}`);
                const weatherData = yield response.json();
                if (weatherData.cod !== "200")
                    throw new Error(`Weather API Error: ${weatherData.message}`);
                return weatherData;
            }
            catch (error) {
                console.error(`Error fetching corrdinates:`, error);
                throw error;
            }
        });
    }
}
