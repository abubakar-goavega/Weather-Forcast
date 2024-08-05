// APIDateFormater.test.ts
import { APIDateFormater } from '../src/formater'; 

describe('APIDateFormater', () => {

    describe('formateDecimal', () => {
        it('should return a string with leading zero for single digit numbers', () => {
            expect(APIDateFormater.formateDecimal(5)).toBe('05');
        });

        it('should return the number itself for double digit numbers', () => {
            expect(APIDateFormater.formateDecimal(12)).toBe(12);
        });
    });

    describe('getFormateTime', () => {
        it('should format the time correctly for AM', () => {
            const date = new Date('2024-08-05T08:30:00'); // Local time
            console.log(date.getHours());
            expect(APIDateFormater.getFormateTime(date)).toEqual(['08:30', 'AM']);
        });

        it('should format the time correctly for PM', () => {
            const date = new Date('2024-08-05T15:45:00');
            expect(APIDateFormater.getFormateTime(date)).toEqual(['03:45', 'PM']);
        });

        it('should handle midnight correctly', () => {
            const date = new Date('2024-08-05T00:00:00');
            expect(APIDateFormater.getFormateTime(date)).toEqual(['12:00', 'AM']);
        });

        it('should handle noon correctly', () => {
            const date = new Date('2024-08-05T12:00:00');
            expect(APIDateFormater.getFormateTime(date)).toEqual(['12:00', 'PM']);
        });
    });

    describe('getFormateApiDate', () => {
        it('should parse a date string and return a Date object', () => {
            const dateTxt = '2024-08-05';
            const expectedDate = new Date(2024, 7, 5); // Note: Month is 0-based
            expect(APIDateFormater.getFormateApiDate(dateTxt)).toEqual(expectedDate);
        });
    });

    describe('getFormateDay', () => {
        it('should return "Today" for the current day', () => {
            const today = new Date();
            expect(APIDateFormater.getFormateDay(today)).toBe('Today');
        });

        it('should return "Tomorrow" for the day after today', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(APIDateFormater.getFormateDay(tomorrow)).toBe('Tomorrow');
        });

        it('should return the day name for a different day', () => {
            const someDay = new Date();
            someDay.setDate(someDay.getDate() + 5); // 5 days from today
            expect(APIDateFormater.getFormateDay(someDay)).toBe(APIDateFormater.days[someDay.getDay()]);
        });
    });

});
