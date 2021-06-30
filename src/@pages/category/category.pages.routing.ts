import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoryViewPage } from "@pages/category/view/category.view.page";

export const categoriesRoutes: Routes = [
    {
        path: ":id",
        component: CategoryViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(categoriesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CategoryPagesRouting { }
