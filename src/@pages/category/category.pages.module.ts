import { NgModule } from"@angular/core";
import { CategoryPagesRouting } from"./category.pages.routing"; 
import { ReactiveFormsModule } from"@angular/forms"; 
import { CategoryViewPage } from "@pages/category/view/category.view.page";
import { ItemTempletesModule } from "@templetes/item/item.templetes.module";
import { StoreModule } from "@ngrx/store";
import * as category from "@reducers/category";
import { CoreModule } from "app/core";
import { EffectsModule } from "@ngrx/effects";
import { ItemEditTempleteEffects } from "@effects/item/edit/templete/item.edit.templete.effects"; 
import { CategoryTempletesModule } from "@templetes/category/category.templetes.module";
@NgModule({
    imports: [
        StoreModule.forFeature(category.featureKey, category.reducers),
        EffectsModule.forFeature([ItemEditTempleteEffects]),
        ReactiveFormsModule,
        CoreModule,
        CategoryPagesRouting,
        ItemTempletesModule,
        CategoryTempletesModule
    ],
    declarations: [
        CategoryViewPage
    ]
})

export class CategoryPagesModule { }
