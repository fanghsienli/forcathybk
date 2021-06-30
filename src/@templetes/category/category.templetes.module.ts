import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";   
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/category";
import {    CategoryAttributesListTempleteEffects, CategoryAttributeEditTempleteEffects} from "@effects/category";  
import { ComponentsModule } from "@components/components.module";
import { CategoryAttributeEditTemplete } from "../categoryAttribute/edit/categoryAttribute.edit.templete"; 
import { CategoryAttributesListTemplete } from "../categoryAttributes/list/categoryAttributes.list.templete";    
@NgModule({
    imports: [
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([CategoryAttributesListTempleteEffects, CategoryAttributeEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule
    ],
    declarations: [
        CategoryAttributesListTemplete,
        CategoryAttributeEditTemplete
    ],
    exports: [
        CategoryAttributesListTemplete,
        CategoryAttributeEditTemplete
    ]
})

export class CategoryTempletesModule { }
