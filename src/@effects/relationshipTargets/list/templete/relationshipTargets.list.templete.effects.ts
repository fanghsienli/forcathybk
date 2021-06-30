import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, asyncScheduler } from "rxjs";
import { switchMap, concatMap, withLatestFrom, debounceTime, map, catchError, tap } from "rxjs/operators";
import { RelationshipTargetsListTempleteActions, RelationshipTargetEditTempleteActions } from "@actions/relationshipTarget";
import * as relationshipTargetReducers from "@reducers/relationshipTarget"; 
import * as reducers from "@reducers";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store"; 
import { InventoriesService } from "@services/inventories.service"; 
import { PresentationActions } from "@actions";
import { AttributesService } from "@services/attributes.service";

@Injectable()
export class RelationshipTargetsListTempleteEffects {
    setItemAttribute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RelationshipTargetsListTempleteActions.setConditions),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.relationshipTargetStore$.pipe(select(relationshipTargetReducers.relationshipTargetsListTempleteState))
                    )
                )
            ),
            switchMap(([payload, state]) => {
                return this.attributesService.find(state.attributeId).pipe(
                    map((attribute) => RelationshipTargetsListTempleteActions.setAttribute({ attribute })),
                    catchError(() => of(RelationshipTargetsListTempleteActions.setAttribute({ attribute: null }))
                    ));

            })
        )
    );

    get$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                RelationshipTargetsListTempleteActions.setSort,
                RelationshipTargetsListTempleteActions.setFilter,
                RelationshipTargetsListTempleteActions.setPageIndex,
                RelationshipTargetsListTempleteActions.setConditions
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(RelationshipTargetsListTempleteActions.selectList()))
        )
    );

    itemsServiceGet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RelationshipTargetsListTempleteActions.selectList),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(
                        this.relationshipTargetStore$.pipe(select(relationshipTargetReducers.relationshipTargetsListTempleteState))
                    )
                )
            ),
            switchMap(([action, state]) => {

                return this.inventoriesService.selectList({
                    anyLike: state.anyLike,
                    query: `940f7ca9-1c56-468c-a9b9-af9eade03872_eq_${state.ownerId}_and_c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019_eq_${state.attributeId}`,
                    itemId: state.attribute.itemIds,
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => RelationshipTargetsListTempleteActions.selectListSuccess({
                        relationshipTargets: x.result,
                        total: x.total
                    })),
                    catchError(error => of(RelationshipTargetsListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RelationshipTargetsListTempleteActions.remove),
            switchMap((payload) => {
                let relationshipTarget = payload.relationshipTarget;
                this.store.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除細節中, 請稍後..." } }));
                return this.inventoriesService.remove(payload.relationshipTarget.id).pipe(
                    tap(() => this.appService.message$.next(`已刪除細節『${relationshipTarget.no}』!`)),
                    map(() => RelationshipTargetsListTempleteActions.removeSuccess({ relationshipTarget })),
                    catchError(() => of(RelationshipTargetsListTempleteActions.removeFailure({ relationshipTarget })))
                );
            })
        )
    );

    finish$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RelationshipTargetsListTempleteActions.removeSuccess,
                RelationshipTargetsListTempleteActions.removeFailure
            ),
            switchMap((payload) => {
                let message = "刪除存量失敗!";
                if (payload.type === RelationshipTargetsListTempleteActions.removeSuccess.type) message = `已刪除存量『${payload.relationshipTarget.no}』!`;
                return of(PresentationActions.close({ message }));

            })
        )
    );

    relationshipTargetEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RelationshipTargetsListTempleteActions.editRelationshipTarget,
                RelationshipTargetsListTempleteActions.newRelationshipTarget
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "relationshipTargetEditTemplete", width: "365px" }));
            })
        )
    );

    setConditions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RelationshipTargetsListTempleteActions.setConditions
            ),
            switchMap((payload) => {
                return of(RelationshipTargetEditTempleteActions.setConditions({ attributeId: payload.attributeId, ownerId: payload.ownerId }));
            })
        )
    );




    constructor(
        private actions$: Actions,
        private inventoriesService: InventoriesService,
        private attributesService: AttributesService,
        private relationshipTargetStore$: Store<relationshipTargetReducers.State>,
        private store: Store<reducers.State>,
        private appService: AppService,
        private router: Router
    ) { }
}
