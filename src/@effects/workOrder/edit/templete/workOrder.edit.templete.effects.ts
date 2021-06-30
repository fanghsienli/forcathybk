import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import { WorkOrderEditTempleteActions } from "@actions/workOrder";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class WorkOrderEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.workOrderReducerStore$.pipe(select(workOrderReducers.workOrderEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增細節中, 請稍後..." } }));
                return this.inventoriesService.createWorkOrder(payload.workOrderWithAttributes).pipe(
                    switchMap((createdWorkOrder: Inventory) => this.inventoriesService.findDetails(createdWorkOrder.id).pipe(
                        tap(() => {
                            this.router.navigate([`workOrders/${createdWorkOrder.id}`]);
                            return this.store.dispatch(PresentationActions.close({ message: `新增細節『${createdWorkOrder.no}』成功!` }));
                        }),
                        map((details: Inventory) => WorkOrderEditTempleteActions.createSuccess({ workOrder: { ...createdWorkOrder, ...details } })))
                    ),
                    catchError(() => of(WorkOrderEditTempleteActions.createFailure({ workOrder: state.workOrder })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.workOrderReducerStore$.pipe(select(workOrderReducers.workOrderEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新細節中, 請稍後..." } }));
                return this.inventoriesService.updateWithAttributes(payload.workOrderWithAttributes.id, payload.workOrderWithAttributes).pipe(
                    switchMap((updatedWorkOrder: Inventory) => this.inventoriesService.findDetails(updatedWorkOrder.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新細節『${updatedWorkOrder.no}』成功!` }))),
                        map((details: Inventory) => {
                            
                           return WorkOrderEditTempleteActions.updateSuccess({ workOrder: { ...updatedWorkOrder, ...details } })
                        })
                    )),
                    catchError(() => of(WorkOrderEditTempleteActions.updateFailure({ workOrder: state.workOrder })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private workOrderReducerStore$: Store<workOrderReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
