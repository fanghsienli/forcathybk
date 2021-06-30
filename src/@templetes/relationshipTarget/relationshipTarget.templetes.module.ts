import { NgModule } from"@angular/core";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from "@angular/forms"; 
import { RelationshipTargetEditTemplete } from "./edit/relationshiptarget.edit.templete";
import { RelationshipTargetsListTemplete } from "../relationshipTargets/list/relationshipTargets.list.templete";
import { AttributeTempletesModule } from "@templetes/attribute/attribute.templetes.module";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import * as reducers from "@reducers/relationshipTarget";
import { RelationshipTargetsListTempleteEffects } from "@effects/relationshipTarget";  
import { ComponentsModule } from "@components/components.module";
import { RelationshipTargetEditTempleteEffects } from "@effects/relationshipTarget/edit/templete/relationshipTarget.edit.templete.effects";
@NgModule({
    imports: [
        StoreModule.forFeature(reducers.featureKey, reducers.reducers),
        EffectsModule.forFeature([RelationshipTargetsListTempleteEffects, RelationshipTargetEditTempleteEffects]),
        ReactiveFormsModule,
        ComponentsModule,
        CoreModule,
        AttributeTempletesModule
    ],
    declarations: [
        RelationshipTargetsListTemplete,
        RelationshipTargetEditTemplete
    ],
    exports: [
        RelationshipTargetsListTemplete,
        RelationshipTargetEditTemplete
    ]
})

export class RelationshipTargetTempletesModule { }
