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

import { Item, ItemAttribute } from "@entities/item";
import {  
    ItemAttributesListTempleteActions,
    ItemViewPageActions
} from "@actions/item";
import { ItemAttributesService } from "@services/itemAttributes.service";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/item"; 
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { PresentationActions } from "@actions";
import { Presentation } from '../../../../@models/app.model';

@Injectable()
export class ItemAttributesListTempleteEffects {
    callGet$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
               // ItemsViewPageActions.setEmpty,
                ItemAttributesListTempleteActions.setSort, 
                ItemAttributesListTempleteActions.setFilter,
                ItemViewPageActions.find//categoryDetail lanuch
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(ItemAttributesListTempleteActions.select()))
        )
    );

    select$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemAttributesListTempleteActions.select),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.pipe(select(reducers.itemAttributesListTempleteState))
                        //,this.store.pipe(select(reducers.itemViewPageState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.itemAttributesService.select({
                    ownerId: state.ownerId,
                    anyLike: state.anyLike,
                    take:5000
                },false).pipe(
                    map((itemAttributes: ItemAttribute[]) => ItemAttributesListTempleteActions.selectSuccess({ itemAttributes })),
                    catchError(error => of(ItemAttributesListTempleteActions.selectError({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemAttributesListTempleteActions.removeItemAttribute),
            switchMap((payload) => {
                let itemAttribute = payload.itemAttribute;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除屬性中, 請稍後..." } }));  
                return this.itemAttributesService.remove(payload.itemAttribute.id).pipe(
                    tap(() => this.appService.message$.next(`已刪除屬性『${itemAttribute.target.value}』!`)),
                    map(() => ItemAttributesListTempleteActions.removeSuccess({ itemAttribute })),
                    catchError(() => of(ItemAttributesListTempleteActions.removeFailure({ itemAttribute })))
                );
            })
        )
    ); 

    finish$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                ItemAttributesListTempleteActions.removeSuccess,
                ItemAttributesListTempleteActions.removeFailure
            ),
            switchMap((payload) => {
                let message = "刪除屬性失敗!";
                if (payload.type === ItemAttributesListTempleteActions.removeSuccess.type) message = `已刪除屬性『${payload.itemAttribute.target.value}』!`;
                return of(PresentationActions.close({ message }));

            })
        )
    ); 

    itemAttributeEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                ItemAttributesListTempleteActions.editItemAttribute,
                ItemAttributesListTempleteActions.Attribute
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "itemAttributeEditTemplete", width: "365px" }));
            })
        )
    ); 

    constructor(
        private actions$: Actions,
        private store: Store<reducers.State>,
        private itemAttributesService: ItemAttributesService,
        public appService: AppService,
        public router: Router
    ) { }
}
