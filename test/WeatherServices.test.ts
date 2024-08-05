// Import necessary modules and classes
import { WeatherService } from '../src/services'; 

// Create a new instance of WeatherService
const API_KEY = "71f03e740fd8efc745f7f544c0baa923"
const weatherService = new WeatherService(API_KEY);

// Mock the global fetch function before running tests
beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

test('should handle successful fetch', async () => {
  const coord = { lat: 51.5074, lon: -0.1278 };
  const weatherData = { cod: "200", list: [] };
  
  // Mock fetch to return a successful response
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    json: async () => weatherData,
  } as Response);

  // Call the method and verify the result
  const data = await weatherService.getWeatherData(coord);
  expect(data).toEqual(weatherData);
});

test('should handle fetch error', async () => {
  const coord = { lat: 51.5074, lon: -0.1278 };
  
  // Mock fetch to return an error response
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    json: async () => ({ message: 'Server Error' }),
  } as Response);

  // Verify that the method throws an error
  await expect(weatherService.getWeatherData(coord)).rejects.toThrow('Http error! status: 500');
});

test('should handle Weather API error', async () => {
  const coord = { lat: 51.5074, lon: -0.1278 };
  
  // Mock fetch to return a successful response but with an API error
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ cod: "400", message: 'Error' }),
  } as Response);

  // Verify that the method throws an API error
  await expect(weatherService.getWeatherData(coord)).rejects.toThrow('Weather API Error: Error');
});

test('should filter five days weather forecast correctly', async () => {
  const coord = { lat: 51.5074, lon: -0.1278 };

  // Mock fetch to return a predefined response
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      cod: "200",
      list: [
        { dt: 0 }, { dt: 1 }, { dt: 2 }, { dt: 3 }, { dt: 4 },
        { dt: 5 }, { dt: 6 }, { dt: 7 }, { dt: 8 }, { dt: 9 },
        { dt: 10 }, { dt: 11 }, { dt: 12 }, { dt: 13 }, { dt: 14 },
        { dt: 15 }, { dt: 16 }, { dt: 17 }, { dt: 18 }, { dt: 19 },
        { dt: 20 }, { dt: 21 }, { dt: 22 }, { dt: 23 }, { dt: 24 },
        { dt: 25 }, { dt: 26 }, { dt: 27 }, { dt: 28 }, { dt: 29 },
        { dt: 30 }, { dt: 31 }, { dt: 32 }, { dt: 33 }, { dt: 34 },
        { dt: 35 }, { dt: 36 }, { dt: 37 }, { dt: 38 }, { dt: 39 },
      ],
    }),
  } as Response);

  const weatherData = await weatherService.getWeatherData(coord);
  const filtered = weatherService.getFilterFiveDaysWeatherForcast(weatherData.list);

  expect(filtered).toHaveLength(6); // 5 days + 1 last element
  expect(filtered[0].dt).toBe(0);
  expect(filtered[1].dt).toBe(8);
  expect(filtered[2].dt).toBe(16);
  expect(filtered[3].dt).toBe(24);
  expect(filtered[4].dt).toBe(32);
  expect(filtered[5].dt).toBe(39);
});
