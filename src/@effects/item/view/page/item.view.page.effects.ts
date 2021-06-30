import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, defer } from "rxjs";
import {
    switchMap,
    withLatestFrom,
    concatMap,

    tap,
    map,
    catchError
} from "rxjs/operators";
import { Item } from "@entities/item";
import {
    ItemViewPageActions, 
    ItemsListTempleteActions,
    ItemEditTempleteActions
} from "@actions/item";
import { AttributesCheckboxTempleteActions } from "@actions/attribute";
import { CategoryViewPageActions } from "@actions/category";
import { ItemsService } from "@services/items.service";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/item";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { ItemAttributeEditTempleteActions } from "@actions/item";
import { PresentationActions } from "@actions";
import { RecipesService } from "@services/recipes.service";
import { Inventory } from '../../../../@entities/inventory';

@Injectable()
export class ItemViewPageEffects {
    find$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemViewPageActions.find),
            switchMap((payload) => {
            return this.itemsService.find(payload.id).pipe(
                map((item: Item) => ItemViewPageActions.findSuccess({ item })),
                catchError(() => of(ItemViewPageActions.findFailure()))
            );
        })
    ));

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemViewPageActions.remove),
            switchMap((payload) => {
                let item = payload.item;
                this.itemStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除品項中, 請稍後..." } }));
                return this.itemsService.remove(payload.item.id).pipe(
                    tap(() => this.router.navigate([`items`])),
                    tap(() => this.itemStore$.dispatch(PresentationActions.close({ message: `刪除品項: ${item.value} 成功!` }))),
                    map(() => ItemsListTempleteActions.removeSuccess({ item })),
                    catchError((x) => of(ItemsListTempleteActions.removeFailure({ item })))
                );
            })
        )
    );

    printInventories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemViewPageActions.printInventories),
            switchMap((payload) => { 
                window.open(`print/inventories?itemId=${payload.item.id}`);
                return of(ItemViewPageActions.printInventoriesOk());
            })
        )
    );

    createRecipe$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemViewPageActions.createRecipe), 
            switchMap((payload) => {
                this.itemStore$.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增配方中, 請稍後..." } }));
                return this.recipeServices.create({ item: payload.item }).pipe(
                    tap((recipe: Inventory) => this.itemStore$.dispatch(PresentationActions.close({ message: `新增配方: ${recipe.no} 成功!` }))),
                    map((recipe: Inventory) => ItemViewPageActions.createRecipeSuccess({ recipe })),
                    catchError(() => of(ItemViewPageActions.createRecipeFailure()))
                );
            })
        )
    );

    itemEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                ItemViewPageActions.editItem
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "itemEditTemplete", width: "365px" }));
            })
        )
    );



    checkStorageSupport$ = createEffect(
        () => defer(() => this.itemsService.supported()),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private itemStore$: Store<reducers.State>,
        private recipeServices: RecipesService,
        private itemsService: ItemsService,
        public appService: AppService,
        public router: Router
    ) { }
}
