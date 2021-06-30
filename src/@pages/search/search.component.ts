import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Subscription } from "rxjs";
import { distinctUntilChanged, debounceTime, tap, switchMap, filter } from "rxjs/operators"; 
import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from "@services/search.service";
import { SearchResult } from "@models/app.model";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
@Component({
    selector: "search",
    templateUrl: "search.component.html",
    styleUrls: ["search.component.css"],
    host: { "class": "SCxLW uzKWK", "role": "main" }
})
export class SearchComponent implements OnInit {
    searchTextSubscription: Subscription;
    activatedRouteSubscription: Subscription;
    searchResults: SearchResult[];

    constructor(
        public appService: AppService,
        public activatedRoute: ActivatedRoute,
        public searchService: SearchService,
        public store: Store<reducers.State>,
        public  router: Router
    ) { }
    goTo(type: string, navigateUrl: string) {
        this.appService.action$.next("預覽");
        this.router.navigate([`${type}/${navigateUrl}`]);
    }
    ngOnInit() {
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (params) => { 
            this.store.dispatch(LayoutActions.setTopLeft({ left: null }));
            this.store.dispatch(LayoutActions.setTopTitle({ title: "搜尋" }));
            this.store.dispatch(LayoutActions.setTopRight({ right: "空白" })); 
            let bottom = this.appService.bottom$.getValue();
            bottom = { type: "nav", active: "搜尋" };
            this.appService.bottom$.next(bottom);
        });

        this.searchTextSubscription = this.appService.searchText$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => {
               this.searchResults = [];
            }),
            filter((searchText: string) => searchText.length > 0),
            tap(() => {
                this.appService.searching$.next(true);
            }),
            switchMap((searchText: string) => this.searchService.select({ anyLike: searchText }, false))
        ).subscribe((searchResults: SearchResult[]) => {
            
            this.searchResults = searchResults;
            this.appService.searching$.next(false);
        });
    }

    ngOnDestroy() {
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.searchTextSubscription) this.searchTextSubscription.unsubscribe();
    }
}
