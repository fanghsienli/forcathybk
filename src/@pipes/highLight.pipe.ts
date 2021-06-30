import { PipeTransform, Pipe } from"@angular/core";

@Pipe({ name:"highlight"})
export class HighLightPipe implements PipeTransform {
    transform(text: string, search: string): string {
        return (search && text) ? text.replace(search, `<span class="highlight2">${search}</span>`) : text;
    }
}