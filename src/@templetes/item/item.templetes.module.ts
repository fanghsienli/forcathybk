import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";  
import { ItemsListTemplete } from "../items/list/items.list.templete";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/item";
import { ItemsListTempleteEffects, ItemAttributesListTempleteEffects, ItemAttributeEditTempleteEffects} from "@effects/item";  
import { ComponentsModule } from "@components/components.module";
import { ItemAttributesListTemplete } from "../itemAttributes/list/itemAttributes.list.templete";   
import { ItemAttributeEditTemplete } from "../itemAttribute/edit/itemAttribute.edit.templete"; 
import { ItemEditTemplete } from "./edit/item.edit.templete";
@NgModule({
    imports: [
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([ItemsListTempleteEffects, ItemAttributesListTempleteEffects, ItemAttributeEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule
    ],
    declarations: [
        ItemEditTemplete,
        ItemsListTemplete,
        ItemAttributesListTemplete,
        ItemAttributeEditTemplete
    ],
    exports: [
        ItemEditTemplete,
        ItemsListTemplete,
        ItemAttributesListTemplete,
        ItemAttributeEditTemplete
    ]
})

export class ItemTempletesModule { }
