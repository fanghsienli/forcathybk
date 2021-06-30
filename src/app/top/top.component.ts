import { Component, OnInit, Input } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { AppService } from "@services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import * as reducers from "@reducers";
import { select, Store } from "@ngrx/store";
import { ItemsListTempleteActions } from "@actions/item";
import { RecipesListTempleteActions } from '../../@actions/recipe';
import { WorkOrdersListTempleteActions } from '../../@actions/workOrder';
@Component({
    selector: "top",
    templateUrl: "top.component.html",
    styleUrls: ["top.component.css"],
    host: { "class": "gW4DF" }
})
export class TopComponent implements OnInit {
    searchText: string;
    searching: boolean;
    searchingSubscription: Subscription;
    inventoriesOpen: boolean;
    action: any;
    actionSubscription: Subscription;
    errors: string[];
    errorsSubscription: Subscription;
    subscription: Subscription;
    topTitle$: Observable<string>;
    topRight$: Observable<string>;
    topLeft$: Observable<string>;
    constructor(
        public location: Location,
        public router: Router,
        public store$: Store<reducers.State>,
        public activatedRoute: ActivatedRoute,
        public appService: AppService) {
        this.topRight$ = store$.pipe(select(reducers.layout_topRight));
        this.topLeft$ = store$.pipe(select(reducers.layout_topLeft));
        this.topTitle$ = store$.pipe(select(reducers.layout_topTitle));
        this.searchText = "";
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.errorsSubscription) this.errorsSubscription.unsubscribe();
        if (this.searchingSubscription) this.searchingSubscription.unsubscribe();
    }

    ngOnInit() {
        this.errorsSubscription = this.appService.errors$.subscribe((errors: string[]) => {
            this.errors = errors;
        });

        this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
            this.action = action || "預覽";
            switch (this.action) {
                case "上頁":
                    this.appService.presentation$.next(null);
                    this.appService.action$.next("預覽");
                    this.location.back();
                    break;
                case "掃碼":
                    this.appService.qrcodeReader$.next(true);
                    break;
                case "預覽":
                    this.appService.qrcodeReader$.next(false);
                    break;
                default:
                    break;
            }
        });
        this.searchingSubscription = this.appService.searching$.subscribe(async (searching: boolean) => {
            this.searching = searching;
        });
    }

    add() {
        if (this.appService.module === "items") this.store$.dispatch(ItemsListTempleteActions.newItem());
        if (this.appService.module === "recipes") this.store$.dispatch(RecipesListTempleteActions.newRecipe());
        if (this.appService.module === "workOrders") this.store$.dispatch(WorkOrdersListTempleteActions.newWorkOrder());
    }

    clear() {
        this.searchText = "";
        this.appService.searchText$.next(this.searchText);
    }
    search(searchText: string) {
        this.searchText = searchText;
        this.appService.searchText$.next(this.searchText);
    }

    nextAction(action) {
        this.appService.action$.next(action);
    }
}
