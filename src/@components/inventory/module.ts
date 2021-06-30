import { NgModule } from "@angular/core";
import { CoreModule } from "app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { InventoryNoComponent } from "./no/component";
import { InventoryValueComponent } from "./value/component";
import { InventoryConfirmComponent } from "./confirm/component";
import { InventoryPutdownComponent } from "./putdown/inventory.putdown.component";

@NgModule({
    imports: [
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [
        InventoryNoComponent,
        InventoryValueComponent,
        InventoryConfirmComponent,
        InventoryPutdownComponent
    ],
    exports: [
        InventoryNoComponent,
        InventoryValueComponent,
        InventoryConfirmComponent,
        InventoryPutdownComponent
    ]
})

export class InventoryComponentsModule { }
