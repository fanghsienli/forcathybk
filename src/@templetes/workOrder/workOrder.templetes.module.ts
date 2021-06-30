import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { WorkOrdersListTemplete } from "../workOrders/list/workOrders.list.templete";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import { WorkOrdersListTempleteEffects } from "@effects/workOrder";  
import { ComponentsModule } from "@components/components.module"; 
import { WorkOrderEventsListTemplete } from "../workOrderEvents/list/workOrderEvents.list.templete";
import { WorkOrderEventEditTemplete } from "../workOrderEvent/edit/workOrderEvent.edit.templete";
import { WorkOrderEditTemplete } from "../workOrder/edit/workOrder.edit.templete";
import { WorkOrderEditTempleteEffects } from "@effects/workOrder/edit/templete/workOrder.edit.templete.effects";
import { WorkOrderEventsListTempleteEffects } from "@effects/workOrderEvents/list/templete/workOrderEvents.list.templete.effects";

@NgModule({
    imports: [
        StoreModule.forFeature(workOrderReducers.featureKey, workOrderReducers.reducers),
        EffectsModule.forFeature([WorkOrdersListTempleteEffects, WorkOrderEditTempleteEffects, WorkOrderEventsListTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule
    ],
    declarations: [
        WorkOrderEditTemplete,
        WorkOrdersListTemplete,
        WorkOrderEventsListTemplete,
        WorkOrderEventEditTemplete
    ],
    exports: [
        WorkOrderEditTemplete,
        WorkOrdersListTemplete,
        WorkOrderEventsListTemplete,
        WorkOrderEventEditTemplete
    ]
})

export class WorkOrderTempletesModule { }
