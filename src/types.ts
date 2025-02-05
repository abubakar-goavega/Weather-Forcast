export type APIResponseList = {
  "dt": number,
  "main": {
    "temp": number,
    "feels_like": number,
    "temp_min": number,
    "temp_max": number,
    "pressure": number,
    "sea_level": number,
    "grnd_level": number,
    "humidity": number,
    "temp_kf": number
  },
  "weather": [
    {
      "id": number,
      "main": string,
      "description": string,
      "icon": string
    }
  ],
  "clouds": {
    "all": number
  },
  "wind": {
    "speed": number,
    "deg": number,
    "gust": number
  },
  "visibility": number,
  "pop": number,
  "rain": {
    "3h": number
  },
  "sys": {
    "pod": string
  },
  "dt_txt": string,
}

export type ApiCityInfoObj = {
    "id": number,
    "name": string,
    "coord": {
      "lat": number,
      "lon": number
    }
    "country": string,
    "population": number,
    "timezone": number,
    "sunrise": number,
    "sunset": number
}

export type WeatherResponse = {
  "cod": number | string,
  "message":number | string,
  "cnt": number | string,
  "list" : APIResponseList[],
  "city" : ApiCityInfoObj
}

export type GeocodingResponse = {
  "name": string,
  "local_names": {
    [index: string]: string
  },
  "lat": number,
  "lon": number,
  "country": string,
  "state": string
}

export type coords = {
  lat : number,
  lon : number
}

export type CityDetails = {
  country : string,
  name : string,
  timezone : number,
  coord : coords
}