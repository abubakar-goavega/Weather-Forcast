import { APIDateFormater } from "./formater.js";
//when testing comment above line and uncomment below
//import { APIDateFormater } from "./formater";
import { APIResponseList, CityDetails } from "./types";

export enum LoadingState {
    LOADING = "loading",
    DONE = "done"
}

export class ForecastUI {

    setLoader(loader: Element, loadingState: LoadingState): void {
        if (loadingState === LoadingState.LOADING)
            loader.classList.remove("loader-hidden");
        else
            loader.classList.add("loader-hidden");
    }

    addFutureForecast(forcasteEle: HTMLElement | Element, foreCast: APIResponseList[]) {
        foreCast.forEach((data) => {
            // const date = formateApiDate(data.dt_txt);
            const { humidity, temp, pressure } = data.main;
            const windSpeed = data.wind.speed;
            const icon = data.weather[0].icon;
            forcasteEle.innerHTML += `
            <div class="weather-forcast-item">
                <div class="day">${APIDateFormater.getFormateDay(APIDateFormater.getFormateApiDate(data.dt_txt))}</div>
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
            `
        });
    }

    setCityDetails(timeZoneEle: HTMLElement | Element | null, zoneEle: HTMLElement | Element | null, cityDetails: CityDetails) {
        if (timeZoneEle !== null && zoneEle !== null) {
            timeZoneEle.innerHTML = `<div>${cityDetails.name + "\n"}, ${cityDetails.country}</div>`;
            zoneEle.innerHTML = `<div>lat:${cityDetails.coord.lat} lon:${cityDetails.coord.lon} GMT${(cityDetails.timezone / 3735.85).toPrecision(2)}</div>`
        }
    }


}