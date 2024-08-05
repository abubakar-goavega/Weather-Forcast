export class APIDateFormater {

    static readonly days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    static readonly months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    static formateDecimal(num: number): string | number {
        return num >= 10 ? num : '0' + num;
    }

    static getFormateTime(date = new Date()): [String, String] {
        let hour: string | number = date.getHours();
        const mintues = APIDateFormater.formateDecimal(date.getMinutes());
        let AMorPM: string = "AM";
        if (hour > 12) {
            AMorPM = "PM";
            hour = APIDateFormater.formateDecimal(hour - 12);
        } else {
            hour = hour == 0 ? 12 : hour;
            hour = APIDateFormater.formateDecimal(hour);
            AMorPM = "AM";
        }
        return [`${hour}:${mintues}`, AMorPM]
    }

    static getFormateApiDate(dateTxt: string): Date {
        const [year, month, date] = dateTxt.split(' ')[0].split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
    }

    static getFormateDay(date: Date): string {
        const today = new Date().getDay();
        let day: string;
        if (today === date.getDay())
            day = "Today";
        else if (today === (date.getDay() - 1))
            day = "Tomorrow";
        else
            day = APIDateFormater.days[date.getDay()];
        return day;
    }

}