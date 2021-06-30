import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as relationshipTargetReducers from "@reducers/relationshipTarget";
import { RelationshipTargetEditTempleteActions } from "@actions/relationshipTarget";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { PresentationActions } from "@actions";
import * as reducers from "@reducers";

@Injectable()
export class RelationshipTargetEditTempleteEffects {
    create$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RelationshipTargetEditTempleteActions.create),
            concatMap(action => of(action).pipe(withLatestFrom(this.relationshipTargetReducerStore$.pipe(select(relationshipTargetReducers.relationshipTargetEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "新增中", div: "新增細節中, 請稍後..." } }));
                return this.inventoriesService.createWithAttributes(payload.relationshipTargetWithAttributes).pipe(
                    switchMap((createdRelationshipTarget: Inventory) => this.inventoriesService.findDetails(createdRelationshipTarget.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `新增細節『${createdRelationshipTarget.no}』成功!` }))),
                        map((details: Inventory) => RelationshipTargetEditTempleteActions.createSuccess({ relationshipTarget: { ...createdRelationshipTarget, ...details } })))
                    ),
                    catchError(() => of(RelationshipTargetEditTempleteActions.createFailure({ relationshipTarget: state.relationshipTarget })))
                );
            })
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RelationshipTargetEditTempleteActions.update),
            concatMap(action => of(action).pipe(withLatestFrom(this.relationshipTargetReducerStore$.pipe(select(relationshipTargetReducers.relationshipTargetEditTempleteState))))),
            switchMap(([payload, state]) => {
                this.store.dispatch(PresentationActions.message({ message: { h3: "更新中", div: "更新細節中, 請稍後..." } }));
                return this.inventoriesService.updateWithAttributes(payload.relationshipTargetWithAttributes.id, payload.relationshipTargetWithAttributes).pipe(
                    switchMap((updatedRelationshipTarget: Inventory) => this.inventoriesService.findDetails(updatedRelationshipTarget.id).pipe(
                        tap(() => this.store.dispatch(PresentationActions.close({ message: `更新細節『${updatedRelationshipTarget.no}』成功!` }))),
                        map((details: Inventory) => RelationshipTargetEditTempleteActions.updateSuccess({ relationshipTarget: { ...updatedRelationshipTarget, ...details } }))
                    )),
                    catchError(() => of(RelationshipTargetEditTempleteActions.updateFailure({ relationshipTarget: state.relationshipTarget })))
                );
            })
        )
    );

    constructor(
        private actions$: Actions,
        private relationshipTargetReducerStore$: Store<relationshipTargetReducers.State>,
        private store: Store<reducers.State>,
        private inventoriesService: InventoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
