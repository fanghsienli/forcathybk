import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { ItemAttribute } from "@entities/item";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/item";
import { ItemAttributeEditTempleteActions } from "@actions/item";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { ItemAttributesService } from "@services/itemAttributes.service";
import { PresentationActions } from "@actions";

@Injectable()
export class ItemAttributeEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemAttributeEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.itemAttributeEditTempleteState))))),
            switchMap(([payload, state]) => {
                if (state.ownerId) {
                    this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增屬性中, 請稍後..." } }));
                    return this.itemAttributesService.create({ ...state.itemAttribute, ...{ ownerId: state.ownerId } }).pipe(
                        tap((itemAttribute: ItemAttribute) => this.store.dispatch(PresentationActions.close({ message: `新增屬性: ${itemAttribute.target.value} 成功!` }))),
                        map((itemAttribute: ItemAttribute) => ItemAttributeEditTempleteActions.createSuccess({ itemAttribute })),
                        catchError(() => of(ItemAttributeEditTempleteActions.createFailure({ itemAttribute: state.itemAttribute })))
                    );
                } else of(ItemAttributeEditTempleteActions.createFailure({ itemAttribute: state.itemAttribute }))
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemAttributeEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.itemAttributeEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新屬性中, 請稍後..." } }));
                return this.itemAttributesService.update(state.itemAttribute.id, state.itemAttribute).pipe(
                    tap((itemAttribute: ItemAttribute) => this.store.dispatch(PresentationActions.close({ message: `更新屬性: ${itemAttribute.target.value} 成功!` }))),
                    map((itemAttribute: ItemAttribute) => ItemAttributeEditTempleteActions.updateSuccess({ itemAttribute })),
                    catchError(() => of(ItemAttributeEditTempleteActions.updateFailure({ itemAttribute: state.itemAttribute })))
                );
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
