import { NgModule } from"@angular/core";
import { SearchComponent } from"./search.component"; 
import { CoreModule } from"app/core/core.module"; 
import { SearchRouting } from"./search.routing"; 
@NgModule({
    imports: [
        CoreModule,
        SearchRouting
    ],
    declarations: [
        SearchComponent 
    ],
    entryComponents: [    
    ],
    providers: [ 
    ]
})

export class SearchModule { }