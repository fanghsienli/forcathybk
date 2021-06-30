import { NgModule } from"@angular/core";
import { ItemPagesRouting } from"./item.pages.routing";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { ItemsViewPage } from "@pages/items/view/items.view.page";
import { ItemViewPage } from "@pages/item/view/item.view.page"; 
import { StoreModule } from "@ngrx/store";
import * as item from "@reducers/item";
import { ItemViewPageEffects, ItemEditTempleteEffects } from "@effects/item";
import { EffectsModule } from "@ngrx/effects";
import { ItemTempletesModule } from "@templetes/item/item.templetes.module";
import { InventoryTempletesModule } from "@templetes/inventory/inventory.templetes.module";

@NgModule({
    imports: [
        StoreModule.forFeature(item.featureKey, item.reducers),
        EffectsModule.forFeature([ItemViewPageEffects, ItemEditTempleteEffects]),
        ReactiveFormsModule,
        CoreModule,
        ItemPagesRouting,
        ItemTempletesModule,
        InventoryTempletesModule
    ],
    declarations: [
        ItemViewPage,
        ItemsViewPage
    ]
})

export class ItemPagesModule { }
