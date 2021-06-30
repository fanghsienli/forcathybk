import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { WorkPlansListTempleteActions } from "@actions/workPlan";
import * as workPlanReducers from "@reducers/workPlan";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";

@Injectable()
export class WorkPlansListTempleteEffects {
    beforeSelect$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                WorkPlansListTempleteActions.setSort,
                WorkPlansListTempleteActions.setFilter,
                WorkPlansListTempleteActions.setPageIndex
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(WorkPlansListTempleteActions.selectList()))
        )
    );

    select$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlansListTempleteActions.selectList),
            concatMap(action => of(action).pipe(withLatestFrom(this.workPlanStore$.pipe(select(workPlanReducers.workPlansListTempleteState))))),
            switchMap(([action, state]) => {
                return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    itemId: "a8867dc9-ae34-48e4-841b-bcbfc826f23b",
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => WorkPlansListTempleteActions.selectListSuccess({
                        workPlans: x.result,
                        total: x.total
                    })),
                    catchError(error => of(WorkPlansListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    ); 


    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkPlansListTempleteActions.remove),
            switchMap((payload) => {
                let workPlan = payload.workPlan;
                this.workPlanStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除配方中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.workPlan.id).pipe( 
                    tap(() => this.workPlanStore$.dispatch(PresentationActions.close({ message: `刪除『${workPlan.no}』成功` }))),
                    map(() => WorkPlansListTempleteActions.removeSuccess({ workPlan })),
                    catchError(() => of(PresentationActions.close({ message: "" })))
                );
            })
        )
    ); 

    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkPlansListTempleteActions.goToEdit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message: "" }));
            })
        )
    );

    workPlanEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkPlansListTempleteActions.editWorkPlan,
                WorkPlansListTempleteActions.newWorkPlan
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "workPlanEditTemplete", width: "365px" }));
            })
        )
    );

    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private workPlanStore$: Store<workPlanReducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
