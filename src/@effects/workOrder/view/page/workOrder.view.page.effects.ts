import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, withLatestFrom, concatMap, catchError, map, tap } from "rxjs/operators";
import { WorkOrderViewPageActions } from "@actions/workOrder";
import { Store, select } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { Inventory } from "@entities/inventory";
import { WorkOrderEventsListTempleteActions } from "@actions/workOrder";
import { AttributesService } from "@services/attributes.service";
import { AttributeEntitiesActions } from "@actions/attribute";
import { PresentationActions } from "@actions";

@Injectable()
export class WorkOrderViewPageEffects {
    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType( 
                WorkOrderViewPageActions.edit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message:"" }));

            })
        )
    ); 

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderViewPageActions.remove),
            switchMap((payload) => {
                let workOrder = payload.workOrder;
                this.workOrderStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除工單中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.workOrder.id).pipe(
                    tap(() => this.router.navigate([`workOrders`])),
                    tap(() => this.workOrderStore$.dispatch(PresentationActions.close({ message: `刪除工單: ${workOrder.no} 成功!` }))),
                    map(() => WorkOrderViewPageActions.removeSuccess({ workOrder })),
                    catchError((x) => of(WorkOrderViewPageActions.removeFailure({ workOrder })))
                );
            })
        )
    );

    find$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderViewPageActions.find),
            switchMap((payload) => {
                return this.inventoriesService.find(payload.id).pipe(
                    map((workOrder: Inventory) => WorkOrderViewPageActions.findSuccess({ workOrder })),
                    catchError(error => of(WorkOrderViewPageActions.findFailure({ error })))
                );
            })
        )
    );

    selectAttributes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkOrderViewPageActions.selectAttributes),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.workOrderStore$.pipe(select(workOrderReducers.workOrderViewPageState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.attributesService.select({
                    itemId: payload.itemId
                }).pipe(
                    tap(attributes => this.workOrderStore$.dispatch(AttributeEntitiesActions.upsertAttributes({ attributes: attributes }))),
                    map(attributes => WorkOrderViewPageActions.selectAttributesSuccess({ attributes })),
                    catchError(error => of(WorkOrderViewPageActions.selectAttributesFailure({ error })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private workOrderStore$: Store<workOrderReducers.State>,
        public appService: AppService,
        public attributesService: AttributesService,
        public inventoriesService: InventoriesService,
        public router: Router
    ) { }
}
