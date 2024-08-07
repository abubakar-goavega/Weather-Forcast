import { ForecastUI , LoadingState } from '../src/forecastui';
import { APIResponseList, CityDetails } from '../src/types';
import { APIDateFormater } from '../src/formater';

// Mocking APIDateFormater for the purpose of these tests
jest.mock('../src/formater', () => ({
    APIDateFormater: {
        getFormateDay: jest.fn((date: string) => date), // Simple mock to return the date
        getFormateApiDate: jest.fn((date: string) => date) // Simple mock to return the date
    }
}));

describe('ForecastUI', () => {
    let forecastUI: ForecastUI;
    let forecastElement: HTMLElement;
    let timeZoneElement: HTMLElement;
    let zoneElement: HTMLElement;

    beforeEach(() => {
        forecastUI = new ForecastUI();

        // Set up DOM elements
        document.body.innerHTML = `
            <div id="forecast"></div>
            <div id="timeZone"></div>
            <div id="zone"></div>
        `;
        forecastElement = document.getElementById('forecast')!;
        timeZoneElement = document.getElementById('timeZone')!;
        zoneElement = document.getElementById('zone')!;
    });

    test('should show loader when loading state is LOADING', () => {
        const loader = document.createElement('div');
        loader.classList.add('loader-hidden');
        forecastUI.setLoader(loader, LoadingState.LOADING);
        expect(loader.classList.contains('loader-hidden')).toBe(false);
    });

    test('should hide loader when loading state is DONE', () => {
        const loader = document.createElement('div');
        loader.classList.remove('loader-hidden');
        forecastUI.setLoader(loader, LoadingState.DONE);
        expect(loader.classList.contains('loader-hidden')).toBe(true);
    });

    test('should add future forecast correctly', () => {
        const forecast: APIResponseList[] = [
            {
                dt: 1618317040,
                main: {
                    temp: 280.32,
                    feels_like: 278.29,
                    temp_min: 279.15,
                    temp_max: 281.15,
                    pressure: 1016,
                    sea_level: 1016,
                    grnd_level: 1013,
                    humidity: 81,
                    temp_kf: 1.17
                },
                weather: [
                    {
                        id: 802,
                        main: 'Clouds',
                        description: 'scattered clouds',
                        icon: '03d'
                    }
                ],
                clouds: {
                    all: 40
                },
                wind: {
                    speed: 4.6,
                    deg: 80,
                    gust: 6.17
                },
                visibility: 10000,
                pop: 0,
                rain: {
                    "3h": 0
                },
                sys: {
                    pod: 'd'
                },
                dt_txt: '2024-08-07 09:00:00'
            }
        ];

        forecastUI.addFutureForecast(forecastElement, forecast);

        expect(forecastElement.innerHTML).toContain('Temperature');
        expect(forecastElement.innerHTML).toContain('280.32');
        expect(forecastElement.innerHTML).toContain('Wind Speed');
        expect(forecastElement.innerHTML).toContain('4.6');
        expect(forecastElement.innerHTML).toContain('Humidity');
        expect(forecastElement.innerHTML).toContain('81');
        expect(forecastElement.innerHTML).toContain('Pressure');
        expect(forecastElement.innerHTML).toContain('1016');
        expect(forecastElement.innerHTML).toContain('https://openweathermap.org/img/wn/03d@2x.png');
    });

    test('should set city details correctly', () => {
        const cityDetails: CityDetails = {
            name: 'London',
            country: 'GB',
            coord: { lat: 51.5085, lon: -0.1257 },
            timezone: 3600
        };

        forecastUI.setCityDetails(timeZoneElement, zoneElement, cityDetails);

        expect(timeZoneElement.innerHTML).toContain(`<div>${cityDetails.name + "\n"}, ${cityDetails.country}</div>`);
        expect(zoneElement.innerHTML).toContain('<div>lat:51.5085 lon:-0.1257 GMT0.96</div>');
    });
});
