import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";  
import { OptionValueComponent } from "./value/component";
import { OptionCodeComponent } from "./code/component";
@NgModule({
    imports: [
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [
        OptionValueComponent,
        OptionCodeComponent
    ],
    exports: [
        OptionValueComponent,
        OptionCodeComponent
    ]
})

export class OptionComponentsModule { }
