import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { AttributesCheckboxTempleteActions, AttributeEntitiesActions } from "@actions/attribute";
import { Store, select } from "@ngrx/store";
import { AttributesService } from "@services/attributes.service";
import * as attributeReducers from "@reducers/attribute";

@Injectable()
export class AttributesCheckboxTempleteEffects {
    beforeSelect$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                AttributesCheckboxTempleteActions.setFilter,
                AttributesCheckboxTempleteActions.setCategoryId,
                AttributesCheckboxTempleteActions.setInventoryId
                //,AttributesCheckboxTempleteActions.setItemId
            ),
            debounceTime(debounce, scheduler),
            switchMap((payload) => {
              return  of(AttributesCheckboxTempleteActions.selectCheckbox())

            })
        )
    );

    selectCheckbox$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AttributesCheckboxTempleteActions.selectCheckbox),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.attributeStore$.pipe(select(attributeReducers.attributesCheckboxTempleteState))
                    )
                )
            ),
            switchMap(([action, state]) => {                 
                return this.attributesService.selectCheckbox({
                    itemId: state.itemId,
                    categoryId: state.categoryId,
                    inventoryId: state.inventoryId,
                    anyLike: state.anyLike
                }).pipe(
                    tap(attributes => this.attributeStore$.dispatch(AttributeEntitiesActions.upsertAttributes({ attributes: attributes }))),
                    map(attributes => AttributesCheckboxTempleteActions.selectCheckboxSuccess({ ids:attributes.map(x => x.id) })),
                    catchError(error => of(AttributesCheckboxTempleteActions.selectCheckboxError({ error })))
                ); 
            })
        )
    );

    constructor(
        private actions$: Actions,
        private attributesService: AttributesService,
        private attributeStore$: Store<attributeReducers.State>
    ) { }
}
