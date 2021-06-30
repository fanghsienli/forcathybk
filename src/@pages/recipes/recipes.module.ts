import { NgModule } from "@angular/core";
import { RecipesRouting } from "./recipes.routing";
import { CoreModule } from "app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RecipesViewPage } from "./view/recipes.view.page";
import { RecipeViewPage } from "@pages/recipe/view/recipe.view.page";
import { InventoryTempletesModule } from "@templetes/inventory/inventory.templetes.module";
import { RelationshipTargetTempletesModule } from "@templetes/relationshipTarget/relationshipTarget.templetes.module";
import { RecipeTempletesModule } from "@templetes/recipe/recipe.templetes.module";
import { OptionComponentsModule } from "@components/option/module";
import { StoreModule } from "@ngrx/store";
import * as recipe from "@reducers/recipe";
import { RecipeViewPageEffects } from "@effects/recipe";
import { EffectsModule } from "@ngrx/effects";

@NgModule({
    imports: [
        StoreModule.forFeature(recipe.featureKey, recipe.reducers),
        EffectsModule.forFeature([RecipeViewPageEffects]),
        RelationshipTargetTempletesModule,
        ReactiveFormsModule,
        CoreModule,
        RecipesRouting,
        RecipeTempletesModule,
        InventoryTempletesModule,
        OptionComponentsModule
    ],
    declarations: [
        RecipeViewPage,
        RecipesViewPage
    ]
})

export class RecipesModule { }
