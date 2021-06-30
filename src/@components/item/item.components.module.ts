import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { ItemCodeComponent } from "./code/item.code.component";
import { ItemValueComponent } from "./value/item.value.component";
import { ItemDescriptionComponent } from "./description/item.description.component";
@NgModule({
    imports: [
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [
        ItemCodeComponent,
        ItemValueComponent,
        ItemDescriptionComponent
    ],
    exports: [
        ItemCodeComponent,
        ItemValueComponent,
        ItemDescriptionComponent
    ]
})

export class ItemComponentsModule { }
