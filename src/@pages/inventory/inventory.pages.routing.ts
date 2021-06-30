import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InventoryViewPage } from "../inventory/view/inventory.view.page";
import { InventoryEditPage } from "../inventory/edit/inventory.edit.page"; 
import { InventoriesPickupPage } from "../inventories/pickup/page"; 

export const inventoriesRoutes: Routes = [
    {
        path: ":id",
        component: InventoryViewPage
    },
    {
        path: ":id/edit",
        component: InventoryEditPage
    },    
    {
        path: ":id/pickup",
        component: InventoriesPickupPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(inventoriesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class InventoryPagesRouting { }
