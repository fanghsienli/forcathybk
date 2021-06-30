import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppService } from "@services/app.service";
import { switchMap, tap } from "rxjs/operators";
import { PresentationActions } from "@actions";
import { of } from 'rxjs';

@Injectable()
export class PresentationEffects {
    message$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PresentationActions.message),
            switchMap((payload) => { 
                this.appService.presentation$.next({});
                return of(PresentationActions.messageOk());
            })
        )
    );

    closePresentation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PresentationActions.close),
            switchMap((payload) => { 
                if (payload.message && payload.message!=="") this.appService.message$.next(payload.message);
                this.appService.presentation$.next(null); 
                return of(PresentationActions.closeOk());
            })
        )
    );
    constructor(
        private actions$: Actions,
        private appService: AppService
    ) { }
}
