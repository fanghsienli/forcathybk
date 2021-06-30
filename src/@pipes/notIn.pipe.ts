import { Pipe, PipeTransform } from"@angular/core";

@Pipe({
    name:"notin",
    pure: false
})
export class NotInPipe implements PipeTransform {

    transform(options: Array<any>, conditions: { [field: string]: any }): Array<any> {
        return options.filter(option => {
            for (let field in conditions) {
                if (option[field] === conditions[field]) {
                    return false;
                }
            }
            return true;
        });
    }
}