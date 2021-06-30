import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { CategoryViewPageActions } from "@actions/category";
import { CategoriesService } from "@services/categories.service";
import { Store, select } from "@ngrx/store";
import * as categoryReducers from "@reducers/category";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Category } from "@entities/category";

@Injectable()
export class CategoryViewPageEffects {
    find$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryViewPageActions.find),
            switchMap((payload) => {
            return this.categoriesService.find(payload.id).pipe(
                map((category: Category) => CategoryViewPageActions.findSuccess({ category })),
                catchError(() => of(CategoryViewPageActions.findFailure()))
            );
        })
    ));

    constructor(
        private actions$: Actions,
        private categoryStore$: Store<categoryReducers.State>,
        private categoriesService: CategoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
