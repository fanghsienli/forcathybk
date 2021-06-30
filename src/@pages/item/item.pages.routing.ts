import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemViewPage } from "@pages/item/view/item.view.page";
import { ItemsViewPage } from "@pages/items/view/items.view.page";
 
export const itemsRoutes: Routes = [
    {
        path: "",
        component: ItemsViewPage
    },
    {
        path: ":id",
        component: ItemViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(itemsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ItemPagesRouting { }
