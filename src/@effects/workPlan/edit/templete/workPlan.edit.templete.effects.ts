import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as workPlanReducers from "@reducers/workPlan";
import { WorkPlanEditTempleteActions } from "@actions/workPlan";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class WorkPlanEditTempleteEffects {/*
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlanEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.workPlanReducerStore$.pipe(select(workPlanReducers.workPlanEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增細節中, 請稍後..." } }));
                return this.inventoriesService.createWorkPlan(payload.workPlanWithAttributes).pipe(
                    switchMap((createdWorkPlan: Inventory) => this.inventoriesService.findDetails(createdWorkPlan.id).pipe(
                        tap(() => {
                            this.router.navigate([`workPlans/${createdWorkPlan.id}`]);
                            return this.store.dispatch(PresentationActions.close({ message: `新增細節『${createdWorkPlan.no}』成功!` }));
                        }),
                        map((details: Inventory) => WorkPlanEditTempleteActions.createSuccess({ workPlan: { ...createdWorkPlan, ...details } })))
                    ),
                    catchError(() => of(WorkPlanEditTempleteActions.createFailure({ workPlan: state.workPlan })))
                );
            })
        )
    );*/

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlanEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.workPlanReducerStore$.pipe(select(workPlanReducers.workPlanEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新細節中, 請稍後..." } }));
                return this.inventoriesService.updateWithAttributes(payload.workPlanWithAttributes.id, payload.workPlanWithAttributes).pipe(
                    switchMap((updatedWorkPlan: Inventory) => this.inventoriesService.findDetails(updatedWorkPlan.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新細節『${updatedWorkPlan.no}』成功!` }))),
                        map((details: Inventory) => {
                            
                           return WorkPlanEditTempleteActions.updateSuccess({ workPlan: { ...updatedWorkPlan, ...details } })
                        })
                    )),
                    catchError(() => of(WorkPlanEditTempleteActions.updateFailure({ workPlan: state.workPlan })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private workPlanReducerStore$: Store<workPlanReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
