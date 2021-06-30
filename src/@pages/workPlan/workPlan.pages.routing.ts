import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkPlanViewPage } from "./view/workPlan.view.page"; 
import { WorkPlansViewPage } from "../workPlans/view/workPlans.view.page"; 
export const workPlansRoutes: Routes = [
    {
        path: "",
        component: WorkPlansViewPage
    },
    {
        path: ":id",
        component: WorkPlanViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(workPlansRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WorkPlanPagesRouting { }
