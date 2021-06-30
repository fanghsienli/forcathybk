import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { InventoriesListTemplete } from "../inventories/list/inventories.list.templete";
import { InventoryComponentsModule } from "@components/inventory/module";
import { AttributeTempletesModule } from "@templetes/attribute/attribute.templetes.module";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/inventory";
import { InventoriesListTempleteEffects } from "@effects/inventory";  
import { ComponentsModule } from "@components/components.module";
import { InventoryAttributesListTemplete } from "../inventoryAttributes/list/inventoryAttributes.list.templete";
import { InventoryEditTemplete } from "./edit/inventory.edit.templete";
import { InventoryEditTempleteEffects } from "@effects/inventory/edit/templete/inventory.edit.templete.effects";
@NgModule({
    imports: [
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([InventoriesListTempleteEffects, InventoryEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule,
        InventoryComponentsModule,
        AttributeTempletesModule
    ],
    declarations: [
        InventoryEditTemplete,
        InventoriesListTemplete,
        InventoryAttributesListTemplete
    ],
    exports: [
        InventoriesListTemplete,
        InventoryAttributesListTemplete,
        InventoryEditTemplete
    ]
})

export class InventoryTempletesModule { }
