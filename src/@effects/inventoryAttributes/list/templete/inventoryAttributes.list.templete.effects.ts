import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { asyncScheduler, EMPTY as empty, of, defer } from "rxjs";
import {
    catchError,
    debounceTime,
    map,
    skip,
    switchMap,
    takeUntil,
    withLatestFrom,
    concatMap,
    tap,
} from "rxjs/operators";

import { Inventory, InventoryAttribute } from "@entities/inventory";
import {  
    InventoryAttributesListTempleteActions
, InventoryViewPageActions } from "@actions/inventory";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/inventory"; 
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";

@Injectable()
export class InventoryAttributesListTempleteEffects {
    get$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
               // InventoriesViewPageActions.setEmpty,
                InventoryAttributesListTempleteActions.setSort, 
                InventoryAttributesListTempleteActions.setFilter,
                InventoryViewPageActions.setId//categoryDetail lanuch
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(InventoryAttributesListTempleteActions.get()))
        )
    );

    inventoriesServiceGet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryAttributesListTempleteActions.get),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.pipe(select(reducers.inventoryAttributesListTempleteState))
                        //,this.store.pipe(select(reducers.inventoryViewPageState))
                    )
                )
            ),
            switchMap(([action, state]) => {
                return this.inventoryAttributesService.get({
                    inventoryId: state.inventoryId,
                    anyLike: state.anyLike
                },false).pipe(
                    map((inventoryAttributes: InventoryAttribute[]) => InventoryAttributesListTempleteActions.getOk({ inventoryAttributes })),
                    catchError(error => of(InventoryAttributesListTempleteActions.getError({ error })))
                );
            })
        )
    );

    setIds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryAttributesListTempleteActions.getOk),
            switchMap((action) => of(InventoryAttributesListTempleteActions.setIds({ ids: action.inventoryAttributes.map(inventory => inventory.id) })))
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryAttributesListTempleteActions.remove),
            switchMap(() => {
                this.appService.action$.next("§R°£(InventoriesListTempleteActions)");
                return of(InventoryAttributesListTempleteActions.removeOk());
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store: Store<reducers.State>,
        private inventoryAttributesService: InventoryAttributesService,
        public appService: AppService,
        public router: Router
    ) { }
}
