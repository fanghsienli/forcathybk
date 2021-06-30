import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { RecipesListTempleteActions } from "@actions/recipe";
import * as recipeReducers from "@reducers/recipe";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";

@Injectable()
export class RecipesListTempleteEffects {
    beforeSelect$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                RecipesListTempleteActions.setSort,
                RecipesListTempleteActions.setFilter,
                RecipesListTempleteActions.setPageIndex
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(RecipesListTempleteActions.selectList()))
        )
    );

    select$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesListTempleteActions.selectList),
            concatMap(action => of(action).pipe(withLatestFrom(this.recipeStore$.pipe(select(recipeReducers.recipesListTempleteState))))),
            switchMap(([action, state]) => {
                return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    itemId: "520934b7-82ed-457e-992f-1bb0cfd3749f",
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => RecipesListTempleteActions.selectListSuccess({
                        recipes: x.result,
                        total: x.total
                    })),
                    catchError(error => of(RecipesListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    ); 


    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesListTempleteActions.remove),
            switchMap((payload) => {
                let recipe = payload.recipe;
                this.recipeStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除配方中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.recipe.id).pipe( 
                    tap(() => this.recipeStore$.dispatch(PresentationActions.close({ message: `刪除『${recipe.no}』成功` }))),
                    map(() => RecipesListTempleteActions.removeSuccess({ recipe })),
                    catchError(() => of(PresentationActions.close({ message: "" })))
                );
            })
        )
    ); 

    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RecipesListTempleteActions.goToEdit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message: "" }));
            })
        )
    );

    recipeTargetEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RecipesListTempleteActions.editRecipe,
                RecipesListTempleteActions.newRecipe
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "recipeEditTemplete", width: "365px" }));
            })
        )
    ); 

    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private recipeStore$: Store<recipeReducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
