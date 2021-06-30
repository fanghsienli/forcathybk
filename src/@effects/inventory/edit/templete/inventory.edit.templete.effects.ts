import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as inventoryReducers from "@reducers/inventory";
import { InventoryEditTempleteActions, InventoriesListTempleteActions } from "@actions/inventory";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class InventoryEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.inventoryReducerStore$.pipe(select(inventoryReducers.inventoryEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增存量中, 請稍後..." } }));
                return this.inventoriesService.createWithAttributes(payload.inventoryWithAttributes).pipe(
                    switchMap((createdInventory: Inventory) => this.inventoriesService.findDetails(createdInventory.id).pipe(
                        tap(() => {
                            //this.router.navigate([`inventories/${createdInventory.id}`]);
                            return this.store.dispatch(PresentationActions.close({ message: `新增配方『${createdInventory.no}』成功!` }));
                        }),
                        map((details: Inventory) => InventoryEditTempleteActions.createSuccess({ inventory: { ...createdInventory, ...details } })))
                    ),
                    catchError(() => of(InventoryEditTempleteActions.createFailure({ inventory: state.inventory })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.inventoryReducerStore$.pipe(select(inventoryReducers.inventoryEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新存量中, 請稍後..." } }));
                
                return this.inventoriesService.updateWithAttributes(payload.inventoryWithAttributes.id, payload.inventoryWithAttributes).pipe(
                    switchMap((updatedInventory: Inventory) => this.inventoriesService.findDetails(updatedInventory.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新配方『${updatedInventory.no}』成功!` }))),
                        map((details: Inventory) => {
                            return InventoryEditTempleteActions.updateSuccess({ inventory: { ...updatedInventory, ...details } })
                        })
                    )),
                    catchError(() => of(InventoryEditTempleteActions.updateFailure({ inventory: state.inventory })))
                );
            })
        )
    );

    inventoryEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                InventoriesListTempleteActions.editInventory,
                InventoriesListTempleteActions.newInventory
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "inventoryEditTemplete", width: "365px" }));
            })
        )
    ); 

    constructor(
        private actions$: Actions,
        private inventoryReducerStore$: Store<inventoryReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
