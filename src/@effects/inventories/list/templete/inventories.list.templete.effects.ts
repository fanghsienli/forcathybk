import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError } from "rxjs/operators";
import { InventoriesListTempleteActions, InventoryViewPageActions } from "@actions/inventory";
import * as inventoryReducers from "@reducers/inventory";
import * as reducers from "@reducers";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { ItemViewPageActions } from "@actions/item";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import { Presentation } from "@models/app.model";

@Injectable()
export class InventoriesListTempleteEffects {
    triggerSelectList$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                InventoriesListTempleteActions.setSort,
                InventoriesListTempleteActions.setFilter,
                InventoriesListTempleteActions.setPageIndex
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(InventoriesListTempleteActions.selectList()))
        )
    );

    selectList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoriesListTempleteActions.selectList),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTempleteState))
                    )
                )
            ),
            switchMap(([action, state]) => {
                if (state.itemId) return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    itemId: state.itemId,
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize,
                    listType: "general"
                }).pipe(
                    map(x => InventoriesListTempleteActions.selectListSuccess({
                        inventories: x.result,
                        total: x.total
                    })),
                    catchError(error => of(InventoriesListTempleteActions.selectListFailure({ error })))
                );
                else return this.inventoriesService.selectList({
                    anyLike: state.anyLike, 
                    inventoryId: state.inventoryId,
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize,
                    listType: "general"
                }).pipe(
                    map(x => InventoriesListTempleteActions.selectListSuccess({
                        inventories: x.result,
                        total: x.total
                    })),
                    catchError(error => of(InventoriesListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoriesListTempleteActions.remove),
            switchMap((payload) => {
                let inventory = payload.inventory;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除存量中, 請稍後..." } }));
                this.appService.message$.next(`已刪除存量『${inventory.no}』!`);
                return this.inventoriesService.remove(payload.inventory.id).pipe(
                    map(() => InventoriesListTempleteActions.removeSuccess({ inventory })),
                    catchError(() => of(InventoriesListTempleteActions.removeFailure({ inventory })))
                );
            })
        )
    );

    finish$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                InventoriesListTempleteActions.removeSuccess,
                InventoriesListTempleteActions.removeFailure
            ),
            switchMap((payload) => {
                let message = "刪除存量失敗!";
                if (payload.type === InventoriesListTempleteActions.removeSuccess.type) message = `已刪除存量『${payload.inventory.no}』!`;
                return of(PresentationActions.close({ message }));

            })
        )
    );


    exportListOk$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoriesListTempleteActions.exportListOk),
            switchMap((payload) => of(PresentationActions.close({ message: "" })))
        )
    );





    goToEdit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoriesListTempleteActions.goToEdit),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTempleteState)))
                )
            ),
            switchMap(([payload, state]) => {
                this.appService.action$.next("預覽");
                this.router.navigate([`inventories/${state.id}/edit`]);
                return of(PresentationActions.close({ message: "" }));
            })
        )
    );

    pickup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InventoriesListTempleteActions.pickup),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTempleteState)))
                )
            ),
            switchMap(([payload, listState]) => {

                this.appService.presentation$.next({ inventory: listState.inventory, action: listState.presentationAction });
                return of(PresentationActions.open({ title: "pickup", width: "240px" }));
            })
        )
    ); 

    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private inventoryStore$: Store<inventoryReducers.State>,
        private store: Store<reducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
