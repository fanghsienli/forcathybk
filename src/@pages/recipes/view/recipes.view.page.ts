import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { InventoriesService } from "@services/inventories.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as XLSX from "xlsx";
import { Inventory } from "@entities/inventory";
import { CategoriesService } from "@services/categories.service"; 
import { map } from "rxjs/operators";
import * as recipeReducers from "@reducers/recipe";
import { RecipesViewPageActions } from "@actions/recipe";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
import { PresentationActions } from "@actions";
@Component({
    selector: "recipesViewPage",
    templateUrl: "recipes.view.page.html",
    styleUrls: ["recipes.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class RecipesViewPage implements OnInit {
    loading: boolean;
    actionsSubscription: Subscription;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public folderFilesService: FolderFilesService,
        public categoriesService: CategoriesService,
        public activatedRoute: ActivatedRoute,
        public store: Store<reducers.State>,
        public recipeStore: Store<recipeReducers.State>
    ) {
        this.actionsSubscription = activatedRoute.params
            .pipe(map(() => RecipesViewPageActions.setEmpty()))
            .subscribe(action => recipeStore.dispatch(action));
        this.loading = true;
    }
    ngOnDestroy() {
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
    }
    create() {
        let newRecipe = new Inventory();
        newRecipe.createdById = this.appService.profile.id;
        newRecipe.itemId = "520934b7-82ed-457e-992f-1bb0cfd3749f";
        this.inventoriesService.create(newRecipe).toPromise().then((createdRecipe: Inventory) => {
            this.appService.action$.next("預覽");
            this.router.navigate([`inventories/${createdRecipe.id}/edit`]);
        });
    }
    inputdata = [];

    uploadExcel(uploadEvent: any) {
       
    }
    upload() {
        this.hiddenUpload.nativeElement.click();
    }

    ngOnInit() {
        
        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "配方列表" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "新增" })); 
        this.appService.bottom$.next({ type: "nav", active: "首頁" });
        this.appService.action$.next("預覽");
    }
}
