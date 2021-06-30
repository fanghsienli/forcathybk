import { NgModule } from "@angular/core";
import { WorkOrderPagesRouting } from "./workOrder.pages.routing";
import { CoreModule } from "app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkOrdersViewPage } from "../workOrders/view/workOrders.view.page";
import { WorkOrderViewPage } from "@pages/workOrder/view/workOrder.view.page";
import { InventoryTempletesModule } from "@templetes/inventory/inventory.templetes.module";
import { WorkOrderTempletesModule } from "@templetes/workOrder/workOrder.templetes.module";
import { OptionComponentsModule } from "@components/option/module";
import { StoreModule } from "@ngrx/store";
import * as workOrder from "@reducers/workOrder";
import { WorkOrderViewPageEffects } from "@effects/workOrder";
import { EffectsModule } from "@ngrx/effects";

@NgModule({
    imports: [
        StoreModule.forFeature(workOrder.featureKey, workOrder.reducers),
        EffectsModule.forFeature([WorkOrderViewPageEffects]),
        ReactiveFormsModule,
        CoreModule,
        WorkOrderPagesRouting,
        WorkOrderTempletesModule,
        InventoryTempletesModule,
        OptionComponentsModule
    ],
    declarations: [
        WorkOrderViewPage,
        WorkOrdersViewPage
    ]
})

export class WorkOrderPagesModule { }
