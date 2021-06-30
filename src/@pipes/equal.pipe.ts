import { Pipe, PipeTransform } from"@angular/core";

@Pipe({
    name:"equal",
    pure: false
})
export class EqualPipe implements PipeTransform {

    transform(options: Array<any>, conditions: { [field: string]: any }): Array<any> {
        if (options) {
            return options.filter(option => {
                for (let field in conditions) {
                    if (option[field] !== conditions[field]) {
                        return false;
                    }
                }
                return true;
            });
        } else return [];
    }
}