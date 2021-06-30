import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { InventoryViewPageActions } from "@actions/inventory";
import * as inventoryReducers from "@reducers/inventory";
import { AppService } from "@services/app.service";
import { Store, select } from "@ngrx/store";
import { PresentationActions } from "@actions";
import { InventoriesService } from "@services/inventories.service";
import * as reducers from "@reducers";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";

import { Location } from "@angular/common";


@Injectable()
export class InventoryViewPageEffects {/*
    oldActions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                InventoryViewPageActions.addInventory,
                InventoryViewPageActions.addInventory,
                InventoryViewPageActions.importInventories,
                InventoryViewPageActions.printInventories,
                InventoryViewPageActions.edit,
                InventoryViewPageActions.remove
            ),
            concatMap(action => of(action).pipe(withLatestFrom(this.inventoryStore.pipe(select(inventoryReducers.inventoryViewPageState))))),
            switchMap(([payload, inventoryViewPageState]) => {
                
                this.appService.action$.next(inventoryViewPageState.oldAction);
                return of(PresentationActions.close({ message: "" }));
            })
        )
    );*/

    pickup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryViewPageActions.pickup),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.inventoryStore.pipe(select(inventoryReducers.inventoryViewPageState)))
                )
            ),
            switchMap(([payload, inventoryViewPageState]) => {
                this.appService.presentation$.next({ inventory: inventoryViewPageState.pickup, action: inventoryViewPageState.presentationAction });
                return of(InventoryViewPageActions.pickupOk());
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryViewPageActions.remove),
            switchMap((payload) => {
                let inventory = payload.inventory;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除存量中, 請稍後..." } }));
                this.appService.message$.next(`已刪除存量『${inventory.no}』!`);
                this.location.back();

                return this.inventoriesService.remove(payload.inventory.id).pipe(
                    tap(() =>this.store.dispatch(PresentationActions.close({ message: "" }))),
                    map(() => InventoryViewPageActions.removeSuccess({ inventory })),

                    catchError(() => of(InventoryViewPageActions.removeFailure({ inventory })))
                );
            })
        )
    );

    printInventories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryViewPageActions.printInventories),
            switchMap((payload) => {
                window.open(`print/inventories?inventoryId=${payload.inventory.id}`);
                return of(InventoryViewPageActions.printInventoriesOk());
            })
        )
    );
    constructor(
        private actions$: Actions,
        private inventoryStore: Store<inventoryReducers.State>,

      public location: Location,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        private appService: AppService
    ) { }
}
