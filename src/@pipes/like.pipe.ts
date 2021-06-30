import { Pipe, PipeTransform } from"@angular/core";

@Pipe({
    name:"like",
    pure: false
})
export class LikePipe implements PipeTransform {
    transform(options: Array<any>, conditions: { [field: string]: any }): Array<any> {
        if (options) {
            return options.filter(option => {
                let result: boolean = false;
                for (let field in conditions) {
                    result = RegExp(conditions[field]).test(option[field]);
                    if (result) break;
                }
                return result;
            });
        } else return [];
    }
}