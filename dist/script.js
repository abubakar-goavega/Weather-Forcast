var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ForecastUI, LoadingState } from "./forecastui.js";
import { APIDateFormater } from "./formater.js";
import { Geocoding, WeatherService } from "./services.js";
const timeEle = document.getElementById('time');
const dateEle = document.getElementById('date');
const curWeatherItemsEl = document.getElementById('current-weather-items');
if (curWeatherItemsEl !== null)
    curWeatherItemsEl.innerHTML = "";
const timeZoneEle = document.getElementById('time-zone');
const forcasteEle = document.getElementById('weather-forcast');
const loader = document.querySelector(".loader");
const zoneEle = document.getElementById('country');
// exposing this because no backend is there to secure from personal api
const API_KEY = "71f03e740fd8efc745f7f544c0baa923";
const weatherService = new WeatherService(API_KEY);
const foreCastUI = new ForecastUI();
function setup() {
    setInterval(() => {
        const date = new Date();
        const [time, AMorPM] = APIDateFormater.getFormateTime(date);
        if (timeEle !== null && dateEle !== null) {
            timeEle.innerHTML = `${time} <span id="am-pm">${AMorPM}</span>`;
            dateEle.innerHTML = `${APIDateFormater.days[date.getDay()]},  ${APIDateFormater.formateDecimal(date.getDate())}   ${APIDateFormater.months[date.getMonth()]}`;
        }
    }, 1000); //seconds  
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
        foreCastUI.setLoader(loader, LoadingState.DONE);
    setup();
});
function setWeatherFromUserLoc() {
    navigator.geolocation.getCurrentPosition((sucess) => {
        // console.log(sucess);
        if (forcasteEle != null) {
            forcasteEle.innerHTML = "";
            let { latitude: lat, longitude: lon } = sucess.coords;
            weatherService.getWeatherData({ lat, lon }).then((res) => {
                foreCastUI.addFutureForecast(forcasteEle, weatherService.getFilterFiveDaysWeatherForcast(res.list));
                foreCastUI.setCityDetails(timeZoneEle, zoneEle, res.city);
            }).catch((error) => {
                console.log(error);
                alert(error.message);
                if (loader != null)
                    foreCastUI.setLoader(loader, LoadingState.DONE);
            });
        }
    }, (error) => {
        console.log(error.message);
        if (error.code === error.PERMISSION_DENIED)
            alert("You have denied location access. To use this feature, please enable location permissions in your browser settings.");
        else
            alert(error.message);
        if (loader != null)
            foreCastUI.setLoader(loader, LoadingState.DONE);
    });
}
const searchBtn = document.getElementById('searchbtn');
const searchInput = document.getElementById('search');
if (searchBtn !== null)
    searchBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (searchInput !== null && forcasteEle != null && loader != null) {
                foreCastUI.setLoader(loader, LoadingState.LOADING);
                forcasteEle.innerHTML = "";
                let geocodingResponse;
                geocodingResponse = yield new Geocoding(API_KEY).getCoordinates(searchInput.value);
                const coords = {
                    lat: geocodingResponse[0].lat,
                    lon: geocodingResponse[0].lon
                };
                const weatherData = yield weatherService.getWeatherData(coords);
                foreCastUI.addFutureForecast(forcasteEle, weatherService.getFilterFiveDaysWeatherForcast(weatherData.list));
                // console.log(weatherData)
                foreCastUI.setCityDetails(timeZoneEle, zoneEle, weatherData.city);
                searchInput.innerHTML = "";
                foreCastUI.setLoader(loader, LoadingState.DONE);
            }
        }
        catch (error) {
            if (error instanceof TypeError)
                alert("Invalid city name or city name not present");
            else
                alert(error);
            console.log(error);
            if (loader != null)
                foreCastUI.setLoader(loader, LoadingState.DONE);
            window.location.reload();
        }
    }));
