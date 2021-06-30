import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { WorkPlansListTemplete } from "../workPlans/list/workPlans.list.templete";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as workPlanReducers from "@reducers/workPlan";
import { WorkPlansListTempleteEffects } from "@effects/workPlan";  
import { ComponentsModule } from "@components/components.module"; 
import { WorkPlanEditTemplete } from "../workPlan/edit/workPlan.edit.templete";
import { WorkPlanEditTempleteEffects } from "@effects/workPlan/edit/templete/workPlan.edit.templete.effects";

@NgModule({
    imports: [
        StoreModule.forFeature(workPlanReducers.featureKey, workPlanReducers.reducers),
        EffectsModule.forFeature([WorkPlansListTempleteEffects, WorkPlanEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule
    ],
    declarations: [
        WorkPlanEditTemplete,
        WorkPlansListTemplete
    ],
    exports: [
        WorkPlanEditTemplete,
        WorkPlansListTemplete
    ]
})

export class WorkPlanTempletesModule { }
