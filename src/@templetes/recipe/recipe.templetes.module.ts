import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { RecipesListTemplete } from "../recipes/list/recipes.list.templete";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/recipe";
import { RecipesListTempleteEffects, RecipeEditTempleteEffects } from "@effects/recipe";  
import { ComponentsModule } from "@components/components.module"; 
import { RecipeEditTemplete } from "./edit/recipe.edit.templete";

@NgModule({
    imports: [
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([RecipesListTempleteEffects, RecipeEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule
    ],
    declarations: [
        RecipesListTemplete,
        RecipeEditTemplete
    ],
    exports: [
        RecipesListTemplete,
        RecipeEditTemplete
    ]
})

export class RecipeTempletesModule { }
