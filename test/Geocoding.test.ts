import {Geocoding} from "../src/services"
// Mock the global fetch function
global.fetch = jest.fn();
const API_KEY = "71f03e740fd8efc745f7f544c0baa923"

describe('Geocoding Class', () => {
    const apiKey = API_KEY;
    let geocoding: Geocoding;

    beforeEach(() => {
        geocoding = new Geocoding(apiKey);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should build correct URL', () => {
        const city = 'London';
        const limit = 5;
        const expectedUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
        
        const url = geocoding.urlBuilder(city, limit);
        
        expect(url.toString()).toBe(expectedUrl);
    });

    test('should validate city name', () => {
        expect(() => geocoding.validateCity('')).toThrow('Provide City Name');
        expect(() => geocoding.validateCity('NY')).toThrow('Provide Proper City Name');
        expect(() => geocoding.validateCity('New York')).not.toThrow();
    });

    test('should handle successful fetch', async () => {
        const city = 'London';
        const response = [{ lat: 51.5074, lon: -0.1278 }];
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
            ok: true,
            json: async () => response,
        } as Response);

        const data = await geocoding.getCoordinates(city);
        expect(data).toEqual(response);
    });

    test('should handle fetch error', async () => {
        const city = 'London';
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as Response);

        await expect(geocoding.getCoordinates(city)).rejects.toThrow('Http error! status: 500');
    });

});