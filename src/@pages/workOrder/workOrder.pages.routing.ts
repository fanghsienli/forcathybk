import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkOrderViewPage } from "./view/workOrder.view.page"; 
import { WorkOrdersViewPage } from "../workOrders/view/workOrders.view.page"; 
export const workOrdersRoutes: Routes = [
    {
        path: "",
        component: WorkOrdersViewPage
    },
    {
        path: ":id",
        component: WorkOrderViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(workOrdersRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WorkOrderPagesRouting { }
