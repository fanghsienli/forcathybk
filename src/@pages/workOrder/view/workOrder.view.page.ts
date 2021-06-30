import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { InventoriesService } from "@services/inventories.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DialogService } from "@services/dialog.service";
import { Inventory, Segmentation } from "@entities/inventory";
import * as workOrderReducers from "@reducers/workOrder";
import * as reducers from "@reducers";
import { SegmentationsService } from "@services/segmentations.service";
import { WorkOrderViewPageActions, WorkOrdersListTempleteActions } from "@actions/workOrder";
import * as LayoutActions from "@actions/layout.actions";
import { switchMap, debounceTime, tap, filter } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { ItemsService } from "@services/items.service";
import { Attribute } from "@entities/attribute";
import { workOrderEvent } from "@reducers/workOrderEvent/edit/templete/workOrderEvent.edit.templete.reducer";
import { Item } from "@entities/item";
@Component({
    selector: "workOrderViewPage",
    templateUrl: "workOrder.view.page.html",
    styleUrls: ["workOrder.view.page.css"],
    host: { "class": "SCxLW uzKWK", "style": "padding-bottom:44px" }
})
export class WorkOrderViewPage implements OnInit {
    upsertIdSubscription: Subscription;
    activatedRouteSubscription: Subscription;
    params: any;
    paramsSubscription: Subscription;
    workOrderGridsFilter: any;
    workOrder: Inventory;
    presentationSubscription: Subscription;
    positionSubscription: Subscription;
    workOrderGridSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    position$: Observable<Position> = this.appService.position$;
    action: string;
    actionSubscription: Subscription;
    workOrder$: Observable<Inventory>;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    workOrderSubscription: Subscription;
    actionsSubscription: Subscription;
    loading: boolean;
    mode: string = "station";
    putdownCommandSubscription: Subscription;
    modeSubscription: Subscription;
    checkedAttributes: Attribute[] = [];
    attributes$: Observable<Attribute[]>;
    command: string;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    ngOnInitSubscription: any;
    optionsSubscription: Subscription;
    options: any[];
    putdowns: any[];
    requestItemValue: string;
    requestAmount: number;
    target: Inventory;
    item: Item;
    workOrderEventId: string;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public folderFilesService: FolderFilesService,
        public dialogService: DialogService,
        public segmentationsService: SegmentationsService,
        public store$: Store<reducers.State>,
        public workOrderStore$: Store<workOrderReducers.State>,
        public itemsService: ItemsService,
        route: ActivatedRoute
    ) {
        this.putdowns = new Array<any>();
    }

    nextAction(action: string) {
        this.appService.action$.next(action);
    }

    ngOnDestroy() {
        if (this.upsertIdSubscription) this.upsertIdSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
        if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.modeSubscription) this.modeSubscription.unsubscribe();
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
    }

    openPrint(workOrderId: string) {
        window.open(`print/workOrders/${workOrderId}`);
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    goToWorkOrder(workOrderId: string) {

        this.router.navigate([`workOrders/${workOrderId}`]);
    }

    goToWorkOrdersPrint(workOrderId: string) {
        this.router.navigate([`workOrders/${workOrderId}/edit`]);
    }

    uploadExcel(evt: any) { }

    more() {
        let buttons = [
            {
                color: "blue",
                title: "編輯",
                action: WorkOrdersListTempleteActions.editWorkOrder,
                params: { workOrder: this.workOrder }
            },
            {
                color: "red",
                title: "刪除",
                action: WorkOrderViewPageActions.remove,
                params: { workOrder: this.workOrder }
            }
        ];
        this.workOrderStore$.dispatch(WorkOrderViewPageActions.more({ buttons }));
    }




    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    selectedInventory: any;
    putdownValue: number = 0;
    maxPutdownValue: number = 0;
    totalPutdownValue: number = 0;
    selectInventory(selectedInventory) {
        let totalPutdownValue = 0;
        if (this.putdowns.length > 0) totalPutdownValue = this.putdowns.map(x => x.value).reduce((a, b) => a + b);
        this.selectedInventory = selectedInventory;
        if ((this.requestAmount - totalPutdownValue) > this.selectedInventory.value) this.maxPutdownValue = this.selectedInventory.value;
        else this.maxPutdownValue = this.requestAmount - totalPutdownValue;
        this.putdownValue = this.maxPutdownValue;
        this.options = [];
        this.keyup("");
    }
    confirmingPutdown: boolean;
    selectingTarget: boolean;
    cancelPutdown() {
        this.totalPutdownValue = 0;
        this.selectingTarget = false;
        this.options = [];
        this.keyup("");
        this.selectedInventory = null;
    }
    addPutdown() {
        this.selectingTarget = false;
        if (this.putdownValue > this.maxPutdownValue) this.putdownValue = this.maxPutdownValue;
        this.putdowns = this.putdowns.filter(x => x.id !== this.selectedInventory.id);
        this.putdowns.push({
            id: this.selectedInventory.id,
            no: this.selectedInventory.no,
            value: this.putdownValue
        });
        this.totalPutdownValue = this.putdowns.map(x => x.value).reduce((a, b) => a + b);
        this.selectedInventory = null;
    }
    removePutdown(selectedPutdown) {
        this.putdowns = this.putdowns.filter(x => x.id !== selectedPutdown.id);
        this.totalPutdownValue = this.putdowns.map(x => x.value).reduce((a, b) => a + b);
    }

    putdown() {

        let segmentations: Segmentation[] = this.putdowns.map((x) => ({
            ownerId: x.id,
            quantity: x.value
        }) as Segmentation);
        this.inventoriesService.createPickup({
            id: this.workOrderEventId,
            itemId: this.item.id,
            targetId: this.target.id,
            workOrderId: this.workOrder.id,
            segmentations: segmentations

        }).toPromise().then((x) => {
            this.appService.workOrderEvent$.next(workOrderEvent);
            this.workOrderStore$.dispatch(WorkOrderViewPageActions.putdownOK());
        });


    }


    setMode(mode) {
        this.workOrderStore$.dispatch(WorkOrderViewPageActions.setMode({ mode }));
    }

    ngOnInit() {
        this.modeSubscription = this.workOrderStore$.select(workOrderReducers.workOrderViewPage_mode).subscribe((mode) => {
            this.mode = mode;
        });

        this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store$.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));

        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "首頁";
        this.appService.bottom$.next(bottom);


        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.loading = true;
            this.workOrderStore$.dispatch(WorkOrderViewPageActions.find({ id: paramMap.get("id") }));
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            if (this.upsertIdSubscription) this.upsertIdSubscription.unsubscribe();
            this.upsertIdSubscription = this.workOrderStore$.pipe(select(workOrderReducers.workOrderViewPage_upsertId)).subscribe((upsertId: string) => {
                if (upsertId !== "") {
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrderStore$.pipe(
                        select(workOrderReducers.workOrderEntities_find(), {
                            id: upsertId
                        })
                    ).subscribe((workOrder: Inventory) => {
                        console.log("upsertId: " + upsertId, workOrder);
                        if (workOrder) {
                            this.workOrder = { ...workOrder };
                            this.inventoriesService.findDetails(this.workOrder.id).toPromise().then((workOrderDetails: Inventory) => {
                                this.workOrder = { ...  this.workOrder, ...workOrderDetails };
                            });
                            this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                            this.store$.dispatch(LayoutActions.setTopTitle({ title: workOrder.no }));
                            this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
                            if (this.mode === "") this.mode = "station";
                            else {
                                this.loading = false;
                                if (this.putdownCommandSubscription) this.putdownCommandSubscription.unsubscribe();
                                this.putdownCommandSubscription = this.workOrderStore$.pipe(select(workOrderReducers.workOrderViewPage_putdownCommand)).subscribe(async (putdownCommand: string) => {
                                    let needAmount = putdownCommand.split("_")[0];
                                    let putdownIds = putdownCommand.split("_")[1];
                                    if (putdownIds) {
                                        this.workOrderEventId = putdownIds.substring(36, 72);
                                        let itemId = putdownIds.substring(72, 108);
                                        this.item = await this.itemsService.find(itemId).toPromise();
                                        this.optionsSubscription = this.anyLike$.pipe(
                                            tap(anyLike => {
                                                if (anyLike === "") this.options = [];
                                            }),
                                            filter(anyLike => anyLike !== ""),
                                            debounceTime(300),
                                            tap(() => { this.loading = true; }),
                                            switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemId: itemId }))
                                        ).subscribe((options: Inventory[]) => {
                                            this.options = options;
                                            this.loading = false;
                                        });
                                        this.requestItemValue = this.item.value;
                                        this.requestAmount = parseFloat(needAmount);
                                        let targetId = putdownIds.substring(108, 144);
                                        this.target = await this.inventoriesService.find(targetId).toPromise();
                                        this.store$.dispatch(LayoutActions.setTopTitle({ title: this.target.no + "要求領料" }));
                                    } else this.mode = "station";
                                });
                            }
                            this.loading = false;
                        }
                    });
                }
            });
        });
    }

    goToInventory(inventoryId: string) {

        this.router.navigate([`inventories/${inventoryId}`]);
    }

    goToRecipe(recipeId: string) {

        this.router.navigate([`recipes/${recipeId}`]);
    }
}
