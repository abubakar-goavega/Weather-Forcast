import { APIResponseList, coords, GeocodingResponse, WeatherResponse } from "./types";

export class Geocoding {
    private baseUrl: string
    constructor(private _apiKey: string) {
        this.baseUrl = "http://api.openweathermap.org/geo/1.0/direct";
    }

    get getBaseUrl() {
        return this.baseUrl;
    }
    set setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    urlBuilder(cityDetails: string, limit: number): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.append('q', cityDetails);
        url.searchParams.append('limit', limit + '');
        url.searchParams.append('appid', this._apiKey);
        return url;
    }

    validateCity(cityDetails: string): never | void {
        if (cityDetails.length === 0)
            throw new Error("Provide City Name");
        if (cityDetails.length <= 3)
            throw new Error("Provide Proper City Name");
    }

    async getCoordinates(cityDetails: string, limit: number = 1): Promise<GeocodingResponse[]> | never {
        this.validateCity(cityDetails);
        const url = this.urlBuilder(cityDetails, limit);
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Http error! status: ${response.status}`);
            const data: GeocodingResponse[] = await response.json();
            return data
        } catch (error) {
            console.error(`Error fetching corrdinates:`, error);
            throw error;
        }
    }
}


export class WeatherService {

    private baseUrl: string
    constructor(private _apiKey: string) {
        this.baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
    }

    get getBaseUrl() {
        return this.baseUrl;
    }
    set setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    urlBuilder(coord: coords): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.append('lat', coord.lat + '');
        url.searchParams.append('lon', coord.lon + '');
        url.searchParams.append('appid', this._apiKey);
        url.searchParams.append('units', 'metric');
        return url;
    }


    getFilterFiveDaysWeatherForcast(list: APIResponseList[]): APIResponseList[] {
        const foreCast: APIResponseList[] = []
        let index = 0;
        const noOfDays = 5;
        const hoursIntervalOfFiveDays = 8;
        for (let i = 0; i < noOfDays; i++) {
            foreCast.push(list[index])
            index += hoursIntervalOfFiveDays;
        }
        foreCast.push(list[index - 1])
        return foreCast;
    }

    async getWeatherData(coord: coords): Promise<WeatherResponse> | never {
        const url = this.urlBuilder(coord);
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Http error! status: ${response.status}`);
            const weatherData: WeatherResponse = await response.json();
            if (weatherData.cod !== "200")
                throw new Error(`Weather API Error: ${weatherData.message}`);
            return weatherData;
        } catch (error) {
            console.error(`Error fetching corrdinates:`, error);
            throw error;
        }
    }

}

