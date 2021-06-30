import { NgModule } from"@angular/core";
import { HomeComponent } from"./home.component"; 
import { CoreModule } from"app/core/core.module"; 
import { HomeRouting } from "./home.routing";
        
@NgModule({
    imports: [
        CoreModule,
        HomeRouting
    ],
    declarations: [
        HomeComponent 
    ]
})

export class HomeModule { }