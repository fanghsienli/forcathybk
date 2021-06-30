import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "@services/app.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Location } from "@angular/common";
import { InventoriesService } from "@services/inventories.service";
import { InventoryGrid } from "@models/inventory";
import { debounceTime, distinctUntilChanged, tap, filter, switchMap } from "rxjs/operators";
import { SearchResult } from "@models/app.model";
import { SearchService } from "@services/search.service";
@Component({
    selector: "officeHeader",
    templateUrl: "officeHeader.component.html",
    styleUrls: ["officeHeader.component.css"],
    host: { "class": "gW4DF" }
})
export class OfficeHeaderComponent implements OnInit {
    participatesOpen: boolean;
    show: boolean;
    walletCount: number;
    action: string;
    activatedRouteSubscription: Subscription;
    walletCountSubscription: Subscription;
    actionSubscription: Subscription;
    searchTextSubscription: Subscription;

    @ViewChild("searchInput") searchInput: ElementRef;
    searching: boolean;
    searchFocused: boolean;
    searchResults: any[];
    searchText: string;
    hoverId: string;
    hoverClear: boolean;
    constructor(
        public inventoriesService: InventoriesService,
        public location: Location,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public appService: AppService,
        public searchService: SearchService) {
        this.searchResults = new Array<SearchResult>();
        this.searchText = "";
        this.searching = false;
    }

    search(searchText: string) {
        this.searchText = searchText;
        this.appService.searchText$.next(this.searchText);
    }
    blur() {
        this.searchFocused = false;
        if (this.hoverId && this.searchResults.length > 0) {
            this.appService.action$.next("預覽");
            let searchResult = this.searchResults.find(x => x.navigateUrl === this.hoverId);
            this.router.navigate([`${searchResult.type}/${searchResult.navigateUrl}`]);
        }
     
        
      

        this.appService.searchText$.next(this.searchText.trim());

    }
    clear() {
        this.searchText = "";
        this.searchInput.nativeElement.value = "";
        this.searchResults = [];
    }
    focus() {
        this.appService.searchText$.next(this.searchText.trim());
        this.searchFocused = true;
        setTimeout(() => { // this will make the execution after the above boolean has changed
            this.searchInput.nativeElement.focus();
        }, 0);
    }
    walletClick() {
        this.router.navigate([`wallet`]);
    }

    ngOnDestroy() {
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.walletCountSubscription) this.walletCountSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.searchTextSubscription) this.searchTextSubscription.unsubscribe();
    }
    getWalletCount(): Promise<number> {
        return new Promise((resolve) => {
            this.walletCount = null;
            this.show = false;
            this.inventoriesService.getCount(this.appService.profile.id).toPromise().then((count: number) => {
                setTimeout(() => { this.show = true; }, 300);
                resolve(count);
            });
        });
    }
    async ngOnInit() {
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.walletCount = await this.getWalletCount();
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                this.action = action;
                switch (this.action) {
                    case "全部提領":
                        this.walletCount = await this.getWalletCount();
                        break;
                    case "確認提領":
                        this.walletCount = await this.getWalletCount();
                        break;
                    case "上頁":
                        this.appService.presentation$.next(null);
                        this.appService.action$.next("預覽");
                        this.location.back();
                        break;
                    case "預覽":
                        this.appService.qrcodeReader$.next(false);
                        break;
                    default:
                        break;
                }
            });
        });

        this.searchTextSubscription = this.appService.searchText$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => {
                this.searchResults = [];
            }),
            filter((searchText: string) => searchText.length > 0),
            tap(() => {
                this.searching = true;
            }),
            switchMap((searchText: string) => this.searchService.select({ anyLike: searchText }, false))
        ).subscribe((searchResults: SearchResult[]) => {

            this.searchResults = searchResults;
            this.searching = false;
        });
    }

    goTo(url: string) {
        this.router.navigate([url]);
    }
}
