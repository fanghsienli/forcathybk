import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Inventory } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { WorkOrdersListTempleteActions } from "@actions/workOrder";
import { Store, select } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { Attribute } from "@entities/attribute";

@Component({
    selector: "workOrdersListTemplete",
    templateUrl: "workOrders.list.templete.html",
    styleUrls: ["workOrders.list.templete.css"]
})
export class WorkOrdersListTemplete implements OnInit {
    hoverId: string;
    action: string;
    idChangeSubscription: Subscription;
    actionSubscription: Subscription;
    workOrdersSubscription: Subscription;
    @ViewChild("exportTable") exportTable: ElementRef;
    activatedRouteSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    loading$: Observable<boolean>;
    checkedAttributes$: Observable<Attribute[]>;
    maxPage: number = 1;
    orderBy: any;
    descending: boolean;
    loading: boolean;
    pageIndex: number = 0;
    pageSize: number = 15;
    workOrders: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedWorkOrder: Inventory;
    presentationSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public inventoriesService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private workOrderStore$: Store<workOrderReducers.State>,
        private attributeStroe: Store<attributeReducers.State>
    ) {
        this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.workOrderStore$.select(workOrderReducers.workOrdersListTemplete_total);
        this.checkedAttributes$ = this.attributeStroe.select(attributeReducers.attributesCheckboxTemplete_checkedAttributes());
        this.workOrders = new Array<Inventory>();
    }

    typeOf(any: any) {
        if (typeof any === "object") return Object.prototype.toString.call(any);
        return typeof any;
    }

    openInventory(inventoryId: string) {
        window.open(`inventories/${inventoryId}`);
    }

    openItem(itemId: string) {
        window.open(`items/${itemId}`);
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) this.descending = this.descending ? false : true;
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.setSort({
            orderBy: this.orderBy,
            descending: this.descending
        }));
        this.reLoad(1);
    }

    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.workOrdersSubscription) this.workOrdersSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.setFilter({ anyLike: anyLike }));
            this.reLoad(1);
        });

        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (action && this.action !== action) {
                    this.action = action;
                    switch (this.action) {
                        case "匯出":
                            this.exportExcel();
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        this.ngOnInitSubscription.add(
            this.workOrderStore$.pipe(select(workOrderReducers.workOrdersListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
                this.idChangeSubscription = this.workOrderStore$.pipe(
                    select(workOrderReducers.workOrderEntities_find(), {
                        id: upsertId
                    })
                ).subscribe((workOrder: Inventory) => {
                    let upsertedWorkOrder = { ...workOrder};
                    if (upsertedWorkOrder) {
                        if (upsertedWorkOrder["order"]) {
                            upsertedWorkOrder["orderId"] = upsertedWorkOrder["order"].id;
                            upsertedWorkOrder["orderNo"] = upsertedWorkOrder["order"].no;
                        }
                        if (upsertedWorkOrder["recipe"]) {
                            upsertedWorkOrder["recipeId"] = upsertedWorkOrder["recipe"].id;
                            upsertedWorkOrder["recipeNo"] = upsertedWorkOrder["recipe"].no;
                        }
                        if (upsertedWorkOrder["pickupTarget"]) {
                            upsertedWorkOrder["pickupTargetId"] = upsertedWorkOrder["pickupTarget"].id;
                            upsertedWorkOrder["pickupTargetNo"] = upsertedWorkOrder["pickupTarget"].no;
                        }

                        for (let i = 0; i < this.workOrders.length; i++) {
                            if (this.workOrders[i].id === upsertedWorkOrder.id) {
                                this.workOrders[i] = upsertedWorkOrder;
                            }
                        }
                        if (!this.workOrders.find(x => x.id === upsertedWorkOrder.id)) this.workOrders.push(upsertedWorkOrder);

                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.workOrderStore$.pipe(select(workOrderReducers.workOrdersListTemplete_removeId)).subscribe((removedId: string) => {

                if (this.workOrders.find(x => x.id === removedId)) this.resultCount--;
                this.workOrders = this.workOrders.filter(x => x.id !== removedId);
            })
        );
    }

    goToWorkOrder(workOrderId: string) {
        this.router.navigate([`workOrders/${workOrderId}`]);
    }

    editWorkOrder(workOrder: Inventory) {
        this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.editWorkOrder({ workOrder }));
    }

    filterWorkOrders(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getWorkOrders(): Promise<Inventory[]> {
        if (this.workOrdersSubscription) this.workOrdersSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.workOrdersSubscription = this.workOrderStore$.pipe(
                select(workOrderReducers.getWorkOrders()),
                filter(x => x.loaded)
            ).subscribe(result => {
                this.resultCount = result.count;
                this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                this.anyLike = result.anyLike;
                resolve(result.workOrders);
            });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.workOrders = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    delete(workOrder: Inventory) {
        this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.remove({ workOrder }));
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreWorkOrders = await this.getWorkOrders();
        if (moreWorkOrders.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreWorkOrders.forEach(workOrder => {
                if (!this.workOrders.find(x => x.id === workOrder.id)) this.workOrders.push({ ...workOrder });
            });
            for (let i = (this.workOrders.length - moreWorkOrders.length); i < this.workOrders.length; i++) {
                this.inventoriesService.findDetails(this.workOrders[i].id).toPromise().then((details: Inventory) => {
                    let workOrder = {
                        ...this.workOrders[i], ...details
                    };
                    
                    if (this.workOrders[i]) {
                        if (this.workOrders[i].id === workOrder.id) {
                            this.workOrders[i] = workOrder;
                        }
                    }
                });
            }
            window.scrollTo({ top: pageYOffset });
            setTimeout(() => this.loading = false, debounceTime);
        } else {
            setTimeout(() => this.loading = false, debounceTime);
        }
    }

    more(workOrder: Inventory) {
        
        this.selectedWorkOrder = { ...workOrder };
        this.selectedWorkOrder._take = 0;
        this.hoverId = this.selectedWorkOrder.id;

        let buttons = [
            {
                color: "blue",
                title: "編輯",
                action: WorkOrdersListTempleteActions.editWorkOrder,
                params: {
                    workOrder: { ...this.selectedWorkOrder }
                }
            },
            {
                color: "red",
                title: "刪除",
                action: WorkOrdersListTempleteActions.remove,
                params: {
                    workOrder: { ...this.selectedWorkOrder }
                }
            }
        ]


        this.workOrderStore$.dispatch(WorkOrdersListTempleteActions.more({ buttons }));
    }
}