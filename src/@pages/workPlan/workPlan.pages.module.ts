import { NgModule } from "@angular/core";
import { WorkPlanPagesRouting } from "./workPlan.pages.routing";
import { CoreModule } from "app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkPlansViewPage } from "../workPlans/view/workPlans.view.page";
import { WorkPlanViewPage } from "@pages/workPlan/view/workPlan.view.page";
import { InventoryTempletesModule } from "@templetes/inventory/inventory.templetes.module";
import { WorkPlanTempletesModule } from "@templetes/workPlan/workPlan.templetes.module";
import { OptionComponentsModule } from "@components/option/module";
import { StoreModule } from "@ngrx/store";
import * as workPlan from "@reducers/workPlan";
import { WorkPlanViewPageEffects } from "@effects/workPlan";
import { EffectsModule } from "@ngrx/effects";
import { WorkOrderTempletesModule } from "@templetes/workOrder/workOrder.templetes.module";

@NgModule({
    imports: [
        StoreModule.forFeature(workPlan.featureKey, workPlan.reducers),
        EffectsModule.forFeature([WorkPlanViewPageEffects]),
        ReactiveFormsModule,
        CoreModule,
        WorkPlanPagesRouting,
        WorkOrderTempletesModule,
        WorkPlanTempletesModule,
        InventoryTempletesModule,
        OptionComponentsModule
    ],
    declarations: [
        WorkPlanViewPage,
        WorkPlansViewPage
    ]
})

export class WorkPlanPagesModule { }
