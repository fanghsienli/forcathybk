import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { InventoryComponentsModule } from "@components/inventory/module";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/attribute";
import { AttributesCheckBoxTemplete } from "../attributes/checkbox/attributes.checkbox.templete"; 
import { AttributesCheckboxTempleteEffects } from "@effects/attribute"; 
@NgModule({
    imports: [
        ReactiveFormsModule,
        CoreModule,
        InventoryComponentsModule,
        EffectsModule.forFeature([AttributesCheckboxTempleteEffects]),
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([]),
    ],
    declarations: [  
        AttributesCheckBoxTemplete
    ],
    exports: [
        AttributesCheckBoxTemplete
    ]
})

export class AttributeTempletesModule { }
