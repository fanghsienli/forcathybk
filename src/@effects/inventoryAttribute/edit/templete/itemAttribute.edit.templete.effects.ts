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
    InventoryViewPageActions, 
    InventoriesListTempleteActions,
    InventoryAttributesListTempleteActions
} from "@actions/inventory";
import { CategoryViewPageActions } from "@actions/category";
import { InventoriesService } from "@services/inventories.service";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/inventory";
import { InventoryAttributeEditTempleteActions } from "@actions/inventory";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";

@Injectable()
export class InventoryAttributeEditTempleteEffects {/*
    pickup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryAttributeEditTempleteActions.create),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.store.pipe(select(reducers.inventoryAttributeEditTempleteState))
                        //,this.store.pipe(select(reducers.selectAttributeEntitiesState))
                    )
                )
            ),
            switchMap(([payload, state
                //,selectAttributeEntitiesState
            ]) => {
                
                this.appService.presentation$.next({ action: "訊息", h3: "新增中", div: "屬性新增中, 請稍後..." });
                
 
                return this.inventoryAttributesService.create(state.inventoryAttribute).pipe(
                    map((inventoryAttribute: InventoryAttribute) => InventoryAttributeEditTempleteActions.createSuccess({ inventoryAttribute })),
                    catchError(() => of(InventoryAttributeEditTempleteActions.createFailure({ inventoryAttribute: state.inventoryAttribute })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoryAttributeEditTempleteActions.update),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.store.pipe(select(reducers.inventoryAttributeEditTempleteState))
                        //,this.store.pipe(select(reducers.selectAttributeEntitiesState))
                    )
                )
            ),
            switchMap(([payload, state]) => {

                this.appService.presentation$.next({ action: "訊息", h3: "更新中", div: "屬性更新中, 請稍後..." });
                let inventoryAttribute = new InventoryAttribute();

                return this.inventoryAttributesService.update(inventoryAttribute.id, inventoryAttribute).pipe(
                    map((inventoryAttribute: InventoryAttribute) => InventoryAttributeEditTempleteActions.updateSuccess({ inventoryAttribute })),
                    catchError(() => of(InventoryAttributeEditTempleteActions.updateFailure({ inventoryAttribute })))
                );
            })
        )
    );

    closePresentation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                InventoryAttributeEditTempleteActions.createSuccess,
                InventoryAttributeEditTempleteActions.updateSuccess
            ),

            switchMap((payload) => {
                if (payload.type === InventoryAttributeEditTempleteActions.createSuccess.type) this.appService.message$.next(`新增屬性: ${payload.inventoryAttribute.target.value} 成功!`);
                else this.appService.message$.next(`更新屬性: ${payload.inventoryAttribute.target.value} 成功!`);
                this.appService.presentation$.next(null);
                return of(InventoryAttributeEditTempleteActions.closePresentation());
            })
        )
    );*/

    constructor(
        private actions$: Actions,
        private store: Store<reducers.State>,
        private inventoryAttributesService: InventoryAttributesService,
        public appService: AppService,
        public router: Router
    ) { }
}
