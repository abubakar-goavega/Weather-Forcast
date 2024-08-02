var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var LoadingState;
(function (LoadingState) {
    LoadingState["LOADING"] = "loading";
    LoadingState["DONE"] = "done";
})(LoadingState || (LoadingState = {}));
const timeEle = document.getElementById('time');
const dateEle = document.getElementById('date');
const curWeatherItemsEl = document.getElementById('current-weather-items');
if (curWeatherItemsEl !== null)
    curWeatherItemsEl.innerHTML = "";
const timeZoneEle = document.getElementById('time-zone');
const forcasteEle = document.getElementById('weather-forcast');
const loader = document.querySelector(".loader");
const API_KEY = "71f03e740fd8efc745f7f544c0baa923";
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
function setLoader(loader, loadingState) {
    if (loadingState === LoadingState.LOADING)
        loader.classList.remove("loader-hidden");
    else
        loader.classList.add("loader-hidden");
}
function formateDecimal(num) {
    return num >= 10 ? num : '0' + num;
}
function formateTime(date = new Date()) {
    let hour = date.getHours();
    const mintues = formateDecimal(date.getMinutes());
    let AMorPM = "AM";
    if (hour > 12) {
        AMorPM = "PM";
        hour = formateDecimal(hour - 12);
    }
    else {
        hour = hour == 0 ? 12 : hour;
        hour = formateDecimal(hour);
        AMorPM = "AM";
    }
    return [`${hour}:${mintues}`, AMorPM];
}
function getLatLonByCityName(cityName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cityName.length === 0)
            throw ("Provide City Name");
        if (cityName.length <= 3)
            throw ("Provide Proper City Name");
        const limit = 1;
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${API_KEY}`;
        try {
            const res = yield fetch(url);
            const json = yield res.json();
            if (loader !== null)
                // loader.classList.remove("loader-hidden");
                setLoader(loader, LoadingState.LOADING);
            return json[0];
        }
        catch (error) {
            console.log(error);
        }
    });
}
/**
 * In Api We get 5 day forcast with 3 hours intervel that will be 40 dataset so to get only single day
 * we first divide 40 / 5 will get 8 that will be intervel for each day
 * 40 / 5 = 8
 * 8 * 3 = 24
 */
function filterFiveDaysWeatherForcast(list) {
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
function formateApiDate(dateTxt) {
    const [year, month, date] = dateTxt.split(' ')[0].split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
}
function formateDay(date) {
    const today = new Date().getDay();
    let day;
    if (today === date.getDay())
        day = "Today";
    else if (today === (date.getDay() - 1))
        day = "Tomorrow";
    else
        day = days[date.getDay()];
    return day;
}
function addFutureForecast(forcasteEle, foreCast) {
    foreCast.forEach((data) => {
        const date = formateApiDate(data.dt_txt);
        const { humidity, temp, pressure } = data.main;
        const windSpeed = data.wind.speed;
        const icon = data.weather[0].icon;
        forcasteEle.innerHTML += `
        <div class="weather-forcast-item">
            <div class="day">${formateDay(date)}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="weather-item">
                <div>Temperature</div>
                <div>${temp}</div>
            </div>
            <div class="weather-item">
                <div>Wind Speed</div>
                <div>${windSpeed}</div>
            </div>
            <div class="weather-item">
                <div>Humidity</div>
                <div>${humidity}</div>
            </div>
            <div class="weather-item">
                <div>Pressure</div>
                <div>${pressure}</div>
            </div>
        </div>
        `;
    });
}
function setCityDetails(country, name, timezone, coord) {
    const zone = document.getElementById("country");
    if (timeZoneEle !== null && zone !== null) {
        timeZoneEle.innerHTML = `<div>${name + "\n"}, ${country}</div>`;
        zone.innerHTML = `<div>lat:${coord.lat} lon:${coord.lon} GMT${(timezone / 3735.85).toPrecision(2)}</div>`;
    }
}
function setWeatherData() {
    return __awaiter(this, arguments, void 0, function* (lat = -1, lon = -1) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        try {
            const res = yield fetch(url);
            console.log(res.status);
            const json = yield res.json();
            const { country, name, timezone, coord } = json.city;
            console.log(json.city);
            setCityDetails(country, name, timezone, coord);
            if (forcasteEle !== null) {
                forcasteEle.innerHTML = "";
                addFutureForecast(forcasteEle, filterFiveDaysWeatherForcast(json.list));
            }
        }
        catch (error) {
            console.log(error);
        }
        setTimeout(() => {
            if (loader !== null)
                // loader.classList.add("loader-hidden");
                setLoader(loader, LoadingState.DONE);
        }, 1000 * 1);
    });
}
function setWeatherFromUserLoc() {
    navigator.geolocation.getCurrentPosition((sucess) => {
        console.log(sucess);
        let { latitude, longitude } = sucess.coords;
        setWeatherData(latitude, longitude);
    });
}
const searchBtn = document.getElementById('searchbtn');
const searchInput = document.getElementById('search');
if (searchBtn !== null)
    searchBtn.addEventListener('click', () => {
        try {
            if (searchInput !== null)
                getLatLonByCityName(searchInput.value).then(obj => {
                    setWeatherData(obj.lat, obj.lon);
                });
        }
        catch (error) {
            console.log(error);
        }
    });
function setup() {
    setInterval(() => {
        const date = new Date();
        const [time, AMorPM] = formateTime(date);
        if (timeEle !== null && dateEle !== null) {
            timeEle.innerHTML = `${time} <span id="am-pm">${AMorPM}</span>`;
            dateEle.innerHTML = `${days[date.getDay()]},  ${formateDecimal(date.getDate())}   ${months[date.getMonth()]}`;
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
        setLoader(loader, LoadingState.DONE);
    setup();
});
export {};
