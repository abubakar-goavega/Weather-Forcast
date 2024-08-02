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
export class WeatherService {
    constructor(APIKEY) {
        this.APIKEY = APIKEY;
    }
    getLatLonByCityName(cityName, url, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            url = `${url}?q=${cityName}&limit=${limit}&appid=${this.APIKEY}`;
            if (cityName.length === 0)
                throw new Error("Provide City Name");
            if (cityName.length <= 3)
                throw new Error("Provide Proper City Name");
            let res;
            try {
                res = yield fetch(url);
                const json = yield res.json();
                return json[0];
            }
            catch (error) {
                console.log(error);
            }
            return;
        });
    }
    /**
     * In Api We get 5 day forcast with 3 hours intervel that will be 40 dataset so to get only single day
     * we first divide 40 / 5 will get 8 that will be intervel for each day
     * 40 / 5 = 8
     * 8 * 3 = 24
     */
    filterFiveDaysWeatherForcast(list) {
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
    getWeatherData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            url = `${url}&appid=${this.APIKEY}&units=metric`;
            try {
                const res = yield fetch(url);
                const json = yield res.json();
                return json;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
