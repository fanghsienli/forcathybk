import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Item } from "@entities/item";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/item";
import { ItemEditTempleteActions } from "@actions/item";
import { AppService } from "@services/app.service";
import { Location } from "@angular/common";
import { ItemsService } from "@services/items.service";
import { PresentationActions } from "@actions";

@Injectable()
export class ItemEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.itemEditTempleteState))))),
            switchMap(([payload, state]) => {
                
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增品項中, 請稍後..." } }));
                return this.itemsService.create(state.item).pipe(
                    tap((item: Item) => this.store.dispatch(PresentationActions.close({ message: `新增品項: ${item.value} 成功!` }))),
                    map((item: Item) => ItemEditTempleteActions.createSuccess({ item })),
                    catchError(() => of(ItemEditTempleteActions.createFailure({ item: state.item })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.itemEditTempleteState))))),
            switchMap(([payload, state]) => {  
                debugger
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新品項中, 請稍後..." } }));
                return this.itemsService.update(state.item.id, state.item).pipe(
                    tap((item: Item) => this.store.dispatch(PresentationActions.close({ message: `更新品項: ${item.value} 成功!` }))),
                    map((item: Item) => ItemEditTempleteActions.updateSuccess({ item })),
                    catchError(() => of(ItemEditTempleteActions.updateFailure({ item: state.item })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store: Store<reducers.State>,
        private itemsService: ItemsService,
        public appService: AppService,
        public location: Location
    ) { }
}
