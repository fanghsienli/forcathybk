import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { WorkOrderEventsListTempleteActions, WorkOrderEventEditTempleteActions } from "@actions/workOrder";
import * as workOrderReducers from "@reducers/workOrder"; 
import * as reducers from "@reducers";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store"; 
import { InventoriesService } from "@services/inventories.service"; 
import { PresentationActions } from "@actions";
import { AttributesService } from "@services/attributes.service";

@Injectable()
export class WorkOrderEventsListTempleteEffects {
    setItemAttribute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEventsListTempleteActions.setConditions),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.workOrderEventStore$.pipe(select(workOrderReducers.workOrderEventsListTempleteState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.attributesService.find(state.attributeId).pipe(
                    map((attribute) => WorkOrderEventsListTempleteActions.setAttribute({ attribute })),
                    catchError(() => of(WorkOrderEventsListTempleteActions.setAttribute({ attribute: null }))
                    ));

            })
        )
    );

    get$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                WorkOrderEventsListTempleteActions.setSort,
                WorkOrderEventsListTempleteActions.setFilter,
                WorkOrderEventsListTempleteActions.setPageIndex,
                WorkOrderEventsListTempleteActions.setConditions
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(WorkOrderEventsListTempleteActions.selectList()))
        )
    );

    itemsServiceGet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEventsListTempleteActions.selectList),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.workOrderEventStore$.pipe(select(workOrderReducers.workOrderEventsListTempleteState))
                    )
                )
            ),
            switchMap(([action, state]) => {

                return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    query: `940f7ca9-1c56-468c-a9b9-af9eade03872_eq_${state.ownerId}_and_c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019_eq_${state.attributeId}`,
                    itemId: state.attribute.itemIds,
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => WorkOrderEventsListTempleteActions.selectListSuccess({
                        workOrderEvents: x.result,
                        total: x.total
                    })),
                    catchError(error => of(WorkOrderEventsListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderEventsListTempleteActions.remove),
            switchMap((payload) => {
                let workOrderEvent = payload.workOrderEvent;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除細節中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.workOrderEvent.id).pipe(
                    tap(() => this.appService.message$.next(`已刪除細節『${workOrderEvent.no}』!`)),
                    map(() => WorkOrderEventsListTempleteActions.removeSuccess({ workOrderEvent })),
                    catchError(() => of(WorkOrderEventsListTempleteActions.removeFailure({ workOrderEvent })))
                );
            })
        )
    );

    finish$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkOrderEventsListTempleteActions.removeSuccess,
                WorkOrderEventsListTempleteActions.removeFailure
            ),
            switchMap((payload) => {
                let message = "刪除存量失敗!";
                if (payload.type === WorkOrderEventsListTempleteActions.removeSuccess.type) message = `已刪除存量『${payload.workOrderEvent.no}』!`;
                return of(PresentationActions.close({ message }));

            })
        )
    );

    workOrderEventEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkOrderEventsListTempleteActions.editWorkOrderEvent,
                WorkOrderEventsListTempleteActions.newWorkOrderEvent
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "workOrderEventEditTemplete", width: "365px" }));
            })
        )
    );

    setConditions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                WorkOrderEventsListTempleteActions.setConditions
            ),
            switchMap((payload) => {
                return of(WorkOrderEventEditTempleteActions.setConditions({ attributeId: payload.attributeId, ownerId: payload.ownerId }));
            })
        )
    );


    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private attributesService: AttributesService,
        private workOrderEventStore$: Store<workOrderReducers.State>,
        private store: Store<reducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
