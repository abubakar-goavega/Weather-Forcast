import { ForecastUI, LoadingState } from "./forecastui.js";
import { APIDateFormater } from "./formater.js";
import { Geocoding, WeatherService } from "./services.js";
import { coords, GeocodingResponse } from "./types.js";

const timeEle = document.getElementById('time');
const dateEle = document.getElementById('date');
const curWeatherItemsEl = document.getElementById('current-weather-items');
if (curWeatherItemsEl !== null)
    curWeatherItemsEl.innerHTML = "";

const timeZoneEle = document.getElementById('time-zone');
const forcasteEle = document.getElementById('weather-forcast');
const loader = document.querySelector(".loader");
const zoneEle = document.getElementById('country');

const API_KEY = "71f03e740fd8efc745f7f544c0baa923"

const weatherService = new WeatherService(API_KEY);
const foreCastUI = new ForecastUI();

function setup(): void {
    setInterval(() => {
        const date = new Date();
        const [time, AMorPM] = APIDateFormater.getFormateTime(date);
        if (timeEle !== null && dateEle !== null) {
            timeEle.innerHTML = `${time} <span id="am-pm">${AMorPM}</span>`;
            dateEle.innerHTML = `${APIDateFormater.days[date.getDay()]},  ${APIDateFormater.formateDecimal(date.getDate())}   ${APIDateFormater.months[date.getMonth()]}`;
        }
    }, 1000) //seconds  
    const form = document.getElementById('form');
    if (form !== null)
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    setWeatherFromUserLoc();
}

window.addEventListener('load', () => {
    if (loader !== null)
        // loader.classList.add("loader-hidden");
        foreCastUI.setLoader(loader, LoadingState.DONE)
    setup();
});

function setWeatherFromUserLoc(): void {
    navigator.geolocation.getCurrentPosition((sucess) => {
        // console.log(sucess);
        if (forcasteEle != null) {
            forcasteEle.innerHTML = "";
            let { latitude: lat, longitude: lon } = sucess.coords;
            weatherService.getWeatherData({ lat, lon }).then((res) => {
                foreCastUI.addFutureForecast(forcasteEle, weatherService.getFilterFiveDaysWeatherForcast(res.list));
                foreCastUI.setCityDetails(timeZoneEle, zoneEle, res.city)
            }).catch((error) =>{ 
                console.log(error)
                alert(error.message)
                if(loader != null)
                foreCastUI.setLoader(loader,LoadingState.DONE)
            })
        }
    });
}

const searchBtn = document.getElementById('searchbtn');
const searchInput = document.getElementById('search');
if (searchBtn !== null)
    searchBtn.addEventListener('click', async () => {
        try {
            if (searchInput !== null && forcasteEle != null && loader != null) {
                foreCastUI.setLoader(loader, LoadingState.LOADING);
                forcasteEle.innerHTML = "";
                let geocodingResponse: GeocodingResponse[]
                geocodingResponse = await new Geocoding(API_KEY).getCoordinates((searchInput as HTMLInputElement).value);
                const coords: coords = {
                    lat: geocodingResponse[0].lat,
                    lon: geocodingResponse[0].lon
                }
                const weatherData = await weatherService.getWeatherData(coords);
                foreCastUI.addFutureForecast(forcasteEle, weatherService.getFilterFiveDaysWeatherForcast(weatherData.list));
                // console.log(weatherData)
                foreCastUI.setCityDetails(timeZoneEle, zoneEle, weatherData.city);
                foreCastUI.setLoader(loader, LoadingState.DONE);
            }
        } catch (error) {
            alert(error)
            console.log(error);
            if(loader != null)
                foreCastUI.setLoader(loader,LoadingState.DONE);
        }
    });
