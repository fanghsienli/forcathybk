import { NgModule } from"@angular/core";
import { InventoryPagesRouting } from"./inventory.pages.routing";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from"@angular/forms"; 
import { InventoryViewPage } from "../inventory/view/inventory.view.page";
import { InventoryEditPage } from "../inventory/edit/inventory.edit.page"; 
import { ItemComponentsModule } from "@components/item/item.components.module";
import { InventoryComponentsModule } from "@components/inventory/module";
import { OptionComponentsModule } from "@components/option/module";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as inventory from "@reducers/inventory";
import { InventoryViewPageEffects } from "@effects/inventory";  
import { InventoriesPickupPage } from "../inventories/pickup/page";
import { InventoryTempletesModule } from "@templetes/inventory/inventory.templetes.module";
import { AttributeTempletesModule } from "@templetes/attribute/attribute.templetes.module";

@NgModule({
    imports: [
        StoreModule.forFeature(inventory.featureKey, inventory.reducers),
        EffectsModule.forFeature([InventoryViewPageEffects,]),
        ReactiveFormsModule,
        CoreModule,
        InventoryTempletesModule,
        AttributeTempletesModule,
        InventoryPagesRouting, 
        ItemComponentsModule,
        OptionComponentsModule,
        InventoryComponentsModule
    ],
    declarations: [
        InventoryViewPage,
        InventoryEditPage,
        InventoriesPickupPage 
    ],
    exports: [
        InventoryViewPage,
        InventoryEditPage,
        InventoriesPickupPage
    ]
})

export class InventoryPagesModule { }
