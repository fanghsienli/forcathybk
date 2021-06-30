import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, withLatestFrom, concatMap, catchError, map, tap } from "rxjs/operators";
import { WorkPlanViewPageActions } from "@actions/workPlan";
import { Store, select } from "@ngrx/store";
import * as workPlanReducers from "@reducers/workPlan";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { Inventory } from "@entities/inventory";
import { AttributesService } from "@services/attributes.service";
import { AttributeEntitiesActions } from "@actions/attribute";
import { PresentationActions } from "@actions";
import { WorkPlansService } from '../../../../@services/workPlans.service';

@Injectable()
export class WorkPlanViewPageEffects {
    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType( 
                WorkPlanViewPageActions.edit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message:"" }));

            })
        )
    ); 

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlanViewPageActions.remove),
            switchMap((payload) => {
                let workPlan = payload.workPlan;
                this.workPlanStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除工單中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.workPlan.id).pipe(
                    tap(() => this.router.navigate([`workPlans`])),
                    tap(() => this.workPlanStore$.dispatch(PresentationActions.close({ message: `刪除工單: ${workPlan.no} 成功!` }))),
                    map(() => WorkPlanViewPageActions.removeSuccess({ workPlan })),
                    catchError((x) => of(WorkPlanViewPageActions.removeFailure({ workPlan })))
                );
            })
        )
    );

    find$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlanViewPageActions.find),
            switchMap((payload) => {
                return this.workPlansService.find(payload.id).pipe(
                    map((workPlan: Inventory) => WorkPlanViewPageActions.findSuccess({ workPlan })),
                    catchError(error => of(WorkPlanViewPageActions.findFailure({ error })))
                );
            })
        )
    );

    selectAttributes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlanViewPageActions.selectAttributes),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.workPlanStore$.pipe(select(workPlanReducers.workPlanViewPageState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.attributesService.select({
                    itemId: payload.itemId
                }).pipe(
                    tap(attributes => this.workPlanStore$.dispatch(AttributeEntitiesActions.upsertAttributes({ attributes: attributes }))),
                    map(attributes => WorkPlanViewPageActions.selectAttributesSuccess({ attributes })),
                    catchError(error => of(WorkPlanViewPageActions.selectAttributesFailure({ error })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private workPlanStore$: Store<workPlanReducers.State>,
        public appService: AppService,
        public attributesService: AttributesService,
        public workPlansService: WorkPlansService,
        public inventoriesService: InventoriesService,
        public router: Router
    ) { }
}
