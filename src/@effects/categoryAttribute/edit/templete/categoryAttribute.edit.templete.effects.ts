import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { CategoryAttribute } from "@entities/category";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers/category";
import { CategoryAttributeEditTempleteActions } from "@actions/category";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { CategoryAttributesService } from "@services/categoryAttributes.service";
import { PresentationActions } from "@actions";

@Injectable()
export class CategoryAttributeEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAttributeEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.categoryAttributeEditTempleteState))))),
            switchMap(([payload, state]) => {
                if (state.ownerId) {
                    this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增屬性中, 請稍後..." } }));
                    return this.categoryAttributesService.create({ ...state.categoryAttribute, ...{ ownerId: state.ownerId } }).pipe(
                        tap((categoryAttribute: CategoryAttribute) => this.store.dispatch(PresentationActions.close({ message: `新增屬性: ${categoryAttribute.target.value} 成功!` }))),
                        map((categoryAttribute: CategoryAttribute) => CategoryAttributeEditTempleteActions.createSuccess({ categoryAttribute })),
                        catchError(() => of(CategoryAttributeEditTempleteActions.createFailure({ categoryAttribute: state.categoryAttribute })))
                    );
                } else of(CategoryAttributeEditTempleteActions.createFailure({ categoryAttribute: state.categoryAttribute }))
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAttributeEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(reducers.categoryAttributeEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新屬性中, 請稍後..." } }));
                return this.categoryAttributesService.update(state.categoryAttribute.id, state.categoryAttribute).pipe(
                    tap((categoryAttribute: CategoryAttribute) => this.store.dispatch(PresentationActions.close({ message: `更新屬性: ${categoryAttribute.target.value} 成功!` }))),
                    map((categoryAttribute: CategoryAttribute) => CategoryAttributeEditTempleteActions.updateSuccess({ categoryAttribute })),
                    catchError(() => of(CategoryAttributeEditTempleteActions.updateFailure({ categoryAttribute: state.categoryAttribute })))
                );
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
