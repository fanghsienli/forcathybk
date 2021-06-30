import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, withLatestFrom, concatMap, debounceTime, catchError, map, tap } from "rxjs/operators";
import { RecipeViewPageActions } from "@actions/recipe";
import { Store, select } from "@ngrx/store";
import * as recipeReducers from "@reducers/recipe";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { Inventory } from "@entities/inventory";
import { RelationshipTargetsListTempleteActions } from "@actions/relationshipTarget";
import { AttributesService } from "@services/attributes.service";
import { AttributeEntitiesActions } from "@actions/attribute";
import { PresentationActions } from "@actions";

@Injectable()
export class RecipeViewPageEffects {
    edit$ = createEffect(() =>
        this.actions$.pipe(
            ofType( 
                RecipeViewPageActions.edit
            ),
            switchMap((payload) => {
                this.router.navigate([`inventories/${payload.id}/edit`]);
                return of(PresentationActions.close({ message:"" }));

            })
        )
    );


    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeViewPageActions.remove),
            switchMap((payload) => { 
                this.recipeStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除配方中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.id).pipe(     
                    tap(() => this.router.navigate([`recipes`])),
                    map(() => PresentationActions.close({ message: "刪除配方成功" })),
                    catchError(() => of(PresentationActions.close({ message: "" })))
                );
            })
        )
    ); 

    setId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeViewPageActions.setId),
            switchMap((payload) => {
                return of(
                    RecipeViewPageActions.selectAttributes({ itemId: "520934b7-82ed-457e-992f-1bb0cfd3749f" }),
                    RecipeViewPageActions.find()
                );
            })
        )
    );

    find$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeViewPageActions.find),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.recipeStore$.pipe(select(recipeReducers.recipeViewPageState))
                    )
                )
            ),
            switchMap(([action, state]) => {
                return this.inventoriesService.find(state.id).pipe(
                    map((recipe: Inventory) => RecipeViewPageActions.findSuccess({ recipe })),
                    catchError(error => of(RecipeViewPageActions.findFailure({ error })))
                );
            })
        )
    );

    switchMode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeViewPageActions.setMode),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.recipeStore$.pipe(select(recipeReducers.recipeViewPageState))
                    )
                )
            ),
            switchMap(([action, state]) => {
                switch (state.mode) {
                    case "inputs":
                        return of(RelationshipTargetsListTempleteActions.setConditions({
                            attributeId: "5d6a85dc-1287-435c-a036-77c946e0dcf6",
                            ownerId: state.id
                        }));
                    case "availableWorkStations":
                        return of(RelationshipTargetsListTempleteActions.setConditions({
                            attributeId: "494cc497-bd8a-4665-89c5-601deda54798",
                            ownerId: state.id
                        }));
                    case "outputs":
                        return of(RelationshipTargetsListTempleteActions.setConditions({
                            attributeId: "af54d8f3-b274-4acb-b55a-45c23b093cb8",
                            ownerId: state.id
                        }));
                    default:
                        return of(RelationshipTargetsListTempleteActions.setConditions({
                            attributeId: "5d6a85dc-1287-435c-a036-77c946e0dcf6",
                            ownerId: state.id
                        }));
                }
                
            })
        )
    );

    selectAttributes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeViewPageActions.selectAttributes),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.recipeStore$.pipe(select(recipeReducers.recipeViewPageState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.attributesService.select({
                    itemId: payload.itemId
                }).pipe(
                    tap(attributes => this.recipeStore$.dispatch(AttributeEntitiesActions.upsertAttributes({ attributes: attributes }))),
                    map(attributes => RecipeViewPageActions.selectAttributesSuccess({ attributes })),
                    catchError(error => of(RecipeViewPageActions.selectAttributesFailure({ error })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private recipeStore$: Store<recipeReducers.State>,
        public appService: AppService,
        public attributesService: AttributesService,
        public inventoriesService: InventoriesService,
        public router: Router
    ) { }
}
