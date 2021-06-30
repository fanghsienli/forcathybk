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

import { Category, CategoryAttribute } from "@entities/category";
import {
    CategoryAttributesListTempleteActions,
    CategoryViewPageActions
} from "@actions/category";
import { CategoryAttributesService } from "@services/categoryAttributes.service";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/category";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { PresentationActions } from "@actions"; 

@Injectable()
export class CategoryAttributesListTempleteEffects {
    callGet$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                // CategorysViewPageActions.setEmpty,
                CategoryAttributesListTempleteActions.setSort,
                CategoryAttributesListTempleteActions.setFilter,
                CategoryViewPageActions.find//categoryDetail lanuch
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(CategoryAttributesListTempleteActions.select()))
        )
    );

    select$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAttributesListTempleteActions.select),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.pipe(select(reducers.categoryAttributesListTempleteState))
                        //,this.store.pipe(select(reducers.categoryViewPageState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.categoryAttributesService.select({
                    ownerId: state.ownerId,
                    anyLike: state.anyLike,
                    take: 5000
                }, false).pipe(
                    map((categoryAttributes: CategoryAttribute[]) => CategoryAttributesListTempleteActions.selectSuccess({ categoryAttributes })),
                    catchError(error => of(CategoryAttributesListTempleteActions.selectError({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAttributesListTempleteActions.removeCategoryAttribute),
            switchMap((payload) => {
                let categoryAttribute = payload.categoryAttribute;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除屬性中, 請稍後..." } }));
                return this.categoryAttributesService.remove(payload.categoryAttribute.id).pipe(
                    tap(() => this.appService.message$.next(`已刪除屬性『${categoryAttribute.target.value}』!`)),
                    map(() => CategoryAttributesListTempleteActions.removeSuccess({ categoryAttribute })),
                    catchError(() => of(CategoryAttributesListTempleteActions.removeFailure({ categoryAttribute })))
                );
            })
        )
    );

    finish$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                CategoryAttributesListTempleteActions.removeSuccess,
                CategoryAttributesListTempleteActions.removeFailure
            ),
            switchMap((payload) => {
                let message = "刪除屬性失敗!";
                if (payload.type === CategoryAttributesListTempleteActions.removeSuccess.type) message = `已刪除屬性『${payload.categoryAttribute.target.value}』!`;
                return of(PresentationActions.close({ message }));

            })
        )
    );

    categoryAttributeEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                CategoryAttributesListTempleteActions.editCategoryAttribute,
                CategoryAttributesListTempleteActions.Attribute
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "categoryAttributeEditTemplete", width: "365px" }));
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store: Store<reducers.State>,
        private categoryAttributesService: CategoryAttributesService,
        public appService: AppService,
        public router: Router
    ) { }
}
