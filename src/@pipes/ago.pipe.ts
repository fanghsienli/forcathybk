import { Pipe, PipeTransform } from"@angular/core";

@Pipe({
    name:"ago",
    pure: true
})
export class AgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return"剛剛";
            const intervals = {
               "年": 31536000,
               "月": 2592000,
               "週": 604800,
               "天": 86400,
               "小時": 3600,
               "分鐘": 60,
               "秒": 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0) return `${counter}${i}前`; 
            }
        }
        return value;
    }

}