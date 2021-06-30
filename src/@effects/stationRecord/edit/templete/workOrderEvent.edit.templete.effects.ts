import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import { WorkOrderEventEditTempleteActions } from "@actions/workOrder";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class WorkOrderEventEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEventEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.workOrderEventReducerStore$.pipe(select(workOrderReducers.workOrderEventEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增細節中, 請稍後..." } }));
                return this.inventoriesService.createWithAttributes(payload.workOrderEventWithAttributes).pipe(
                    switchMap((createdWorkOrderEvent: Inventory) => this.inventoriesService.findDetails(createdWorkOrderEvent.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `新增細節『${createdWorkOrderEvent.no}』成功!` }))),
                        map((details: Inventory) => WorkOrderEventEditTempleteActions.createSuccess({ workOrderEvent: { ...createdWorkOrderEvent, ...details } })))
                    ),
                    catchError(() => of(WorkOrderEventEditTempleteActions.createFailure({ workOrderEvent: state.workOrderEvent })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEventEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.workOrderEventReducerStore$.pipe(select(workOrderReducers.workOrderEventEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新細節中, 請稍後..." } }));
                return this.inventoriesService.updateWithAttributes(payload.workOrderEventWithAttributes.id, payload.workOrderEventWithAttributes).pipe(
                    switchMap((updatedWorkOrderEvent: Inventory) => this.inventoriesService.findDetails(updatedWorkOrderEvent.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新細節『${updatedWorkOrderEvent.no}』成功!` }))),
                        map((details: Inventory) => WorkOrderEventEditTempleteActions.updateSuccess({ workOrderEvent: { ...updatedWorkOrderEvent, ...details } }))
                    )),
                    catchError(() => of(WorkOrderEventEditTempleteActions.updateFailure({ workOrderEvent: state.workOrderEvent })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private workOrderEventReducerStore$: Store<workOrderReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
