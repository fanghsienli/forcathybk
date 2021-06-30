import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { ItemsService } from "@services/items.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as XLSX from "xlsx";
import { Item } from "@entities/item";
import { Category } from "@entities/category";
import { CategoriesService } from "@services/categories.service";
import { map } from "rxjs/operators";
import * as itemReducers from "@reducers/item";
import { ItemsViewPageActions, ItemsListTempleteActions } from "@actions/item";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
import { PresentationActions } from "@actions";
@Component({
    selector: "itemsViewPage",
    templateUrl: "items.view.page.html",
    styleUrls: ["items.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class ItemsViewPage implements OnInit {
    loading: boolean;
    actionsSubscription: Subscription;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public itemsService: ItemsService,
        public folderFilesService: FolderFilesService,
        public categoriesService: CategoriesService,
        public activatedRoute: ActivatedRoute,
        public store$: Store<reducers.State>,
        public itemStore: Store<itemReducers.State>
    ) {
        this.actionsSubscription = activatedRoute.params
            .pipe(map(() => ItemsViewPageActions.setEmpty()))
            .subscribe(action => itemStore.dispatch(action));
        this.loading = true;
    }
    itemsSubscription: Subscription;
    ngOnDestroy() {
        if (this.itemsSubscription) this.itemsSubscription.unsubscribe();
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
    }
    create() {

        this.store$.dispatch(ItemsListTempleteActions.newItem());
    }
    inputdata = [];
    action: string;
    ngOnInit() {
        this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store$.dispatch(LayoutActions.setTopTitle({ title: "品項列表" }));
        this.store$.dispatch(LayoutActions.setTopRight({ right: "新增" }));
        this.appService.bottom$.next({ type: "nav", active: "首頁" });
        this.appService.action$.subscribe((action) => {
            if (!action) action = "預覽";
            if (this.appService.module === "items" && this.appService.action === "view") {
                this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                this.store$.dispatch(LayoutActions.setTopTitle({ title: "品項列表" }));
                this.store$.dispatch(LayoutActions.setTopRight({ right: "新增" }));
            }
        });
    }
}
