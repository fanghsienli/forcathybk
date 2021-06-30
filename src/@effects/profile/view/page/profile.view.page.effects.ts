import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, withLatestFrom, concatMap } from "rxjs/operators";
import { ProfileViewPageActions } from "@actions/profile";
import { Store, select } from "@ngrx/store";
import * as profileReducers from "@reducers/profile";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";

@Injectable()
export class ProfileViewPageEffects {
    oldActions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                ProfileViewPageActions.logout
            ),
            concatMap(action =>
                of(action).pipe(
                    withLatestFrom(this.profileStore.pipe(select(profileReducers.profileViewPageState)))
                )
            ),
            switchMap(([payload, state]) => {
                this.appService.action$.next(state.oldAction);
                return of(ProfileViewPageActions.oldActionOk());
            })
        )
    );

    constructor(
        private actions$: Actions,
        private profileStore: Store<profileReducers.State>, 
        public appService: AppService,
        public router: Router
    ) { }
}
