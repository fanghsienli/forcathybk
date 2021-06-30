import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as recipeReducers from "@reducers/recipe";
import { RecipeEditTempleteActions } from "@actions/recipe";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class RecipeEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.recipeReducerStore$.pipe(select(recipeReducers.recipeEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增配方中, 請稍後..." } }));
                return this.inventoriesService.createWithAttributes(payload.recipeWithAttributes).pipe(
                    switchMap((createdRecipe: Inventory) => this.inventoriesService.findDetails(createdRecipe.id).pipe(
                        tap(() => {
                            this.router.navigate([`recipes/${createdRecipe.id}`]);
                           return this.store.dispatch(PresentationActions.close({ message: `新增配方『${createdRecipe.no}』成功!` }));
                        }),
                        map((details: Inventory) => RecipeEditTempleteActions.createSuccess({ recipe: { ...createdRecipe, ...details } })))
                    ),
                    catchError(() => of(RecipeEditTempleteActions.createFailure({ recipe: state.recipe })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.recipeReducerStore$.pipe(select(recipeReducers.recipeEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新配方中, 請稍後..." } }));
                return this.inventoriesService.updateWithAttributes(payload.recipeWithAttributes.id, payload.recipeWithAttributes).pipe(
                    switchMap((updatedRecipe: Inventory) => this.inventoriesService.findDetails(updatedRecipe.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新配方『${updatedRecipe.no}』成功!` }))),
                        map((details: Inventory) => {
                            
                           return RecipeEditTempleteActions.updateSuccess({ recipe: { ...updatedRecipe, ...details } })
                        })
                    )),
                    catchError(() => of(RecipeEditTempleteActions.updateFailure({ recipe: state.recipe })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private recipeReducerStore$: Store<recipeReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
