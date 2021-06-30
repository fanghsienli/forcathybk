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
import * as workPlanReducers from "@reducers/workPlan";
import { WorkPlansViewPageActions, WorkPlansListTempleteActions } from "@actions/workPlan";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
import { PresentationActions } from "@actions";
@Component({
    selector: "workPlansViewPage",
    templateUrl: "workPlans.view.page.html",
    styleUrls: ["workPlans.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class WorkPlansViewPage implements OnInit {
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
        public workPlanStore$: Store<workPlanReducers.State>
    ) {
        this.actionsSubscription = activatedRoute.params
            .pipe(map(() => WorkPlansViewPageActions.setEmpty()))
            .subscribe(action => workPlanStore$.dispatch(action));
        this.loading = true;
    }
    ngOnDestroy() {
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
    }
    create() {
        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.newWorkPlan());
  
    }
    inputdata = [];

    uploadExcel(uploadEvent: any) {
    }
    upload() {
        this.hiddenUpload.nativeElement.click();
    }

    ngOnInit() {
        
        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "管制卡列表" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "新增" })); 
        this.appService.bottom$.next({ type: "nav", active: "首頁" });
        this.appService.action$.next("預覽");
    }
}
