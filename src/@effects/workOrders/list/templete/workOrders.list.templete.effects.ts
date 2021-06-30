import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { WorkOrdersListTempleteActions } from "@actions/workOrder";
import * as workOrderReducers from "@reducers/workOrder";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";

@Injectable()
export class WorkOrdersListTempleteEffects {
    beforeSelect$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                WorkOrdersListTempleteActions.setSort,
                WorkOrdersListTempleteActions.setFilter,
                WorkOrdersListTempleteActions.setPageIndex
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(WorkOrdersListTempleteActions.selectList()))
        )
    );

    select$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrdersListTempleteActions.selectList),
            concatMap(action => of(action).pipe(withLatestFrom(this.workOrderStore$.pipe(select(workOrderReducers.workOrdersListTempleteState))))),
            switchMap(([action, state]) => {
                return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    itemId: "a8867dc9-ae34-48e4-841b-bcbfc826f23b",
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => WorkOrdersListTempleteActions.selectListSuccess({
                        workOrders: x.result,
                        total: x.total
                    })),
                    catchError(error => of(WorkOrdersListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    ); 


    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrdersListTempleteActions.remove),
            switchMap((payload) => {
                let workOrder = payload.workOrder;
                this.workOrderStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除配方中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.workOrder.id).pipe( 
                    tap(() => this.workOrderStore$.dispatch(PresentationActions.close({ message: `刪除『${workOrder.no}』成功` }))),
                    map(() => WorkOrdersListTempleteActions.removeSuccess({ workOrder })),
                    catchError(() => of(PresentationActions.close({ message: "" })))
                );
            })
        )
    ); 

    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkOrdersListTempleteActions.goToEdit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message: "" }));
            })
        )
    );

    workOrderEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkOrdersListTempleteActions.editWorkOrder,
                WorkOrdersListTempleteActions.newWorkOrder
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "workOrderEditTemplete", width: "365px" }));
            })
        )
    );

    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private workOrderStore$: Store<workOrderReducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
