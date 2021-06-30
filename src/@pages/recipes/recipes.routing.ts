import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipeViewPage } from "../recipe/view/recipe.view.page"; 
import { RecipesViewPage } from "./view/recipes.view.page"; 
export const recipesRoutes: Routes = [
    {
        path: "",
        component: RecipesViewPage
    },
    {
        path: ":id",
        component: RecipeViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(recipesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class RecipesRouting { }
