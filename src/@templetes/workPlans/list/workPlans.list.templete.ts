import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Inventory } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { WorkPlansListTempleteActions } from "@actions/workPlan";
import { Store, select } from "@ngrx/store";
import * as workPlanReducers from "@reducers/workPlan";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { Attribute } from "@entities/attribute";

@Component({
    selector: "workPlansListTemplete",
    templateUrl: "workPlans.list.templete.html",
    styleUrls: ["workPlans.list.templete.css"]
})
export class WorkPlansListTemplete implements OnInit {
    hoverId: string;
    action: string;
    idChangeSubscription: Subscription;
    actionSubscription: Subscription;
    workPlansSubscription: Subscription;
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
    workPlans: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedWorkPlan: Inventory;
    presentationSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public inventoriesService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private workPlanStore$: Store<workPlanReducers.State>,
        private attributeStroe: Store<attributeReducers.State>
    ) {
        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.workPlanStore$.select(workPlanReducers.workPlansListTemplete_total);
        this.checkedAttributes$ = this.attributeStroe.select(attributeReducers.attributesCheckboxTemplete_checkedAttributes());
        this.workPlans = new Array<Inventory>();
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
        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.setSort({
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
        if (this.workPlansSubscription) this.workPlansSubscription.unsubscribe();
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
            this.workPlanStore$.dispatch(WorkPlansListTempleteActions.setFilter({ anyLike: anyLike }));
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
            this.workPlanStore$.pipe(select(workPlanReducers.workPlansListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
                this.idChangeSubscription = this.workPlanStore$.pipe(
                    select(workPlanReducers.workPlanEntities_find(), {
                        id: upsertId
                    })
                ).subscribe((workPlan: Inventory) => {
                    let upsertedWorkPlan = { ...workPlan};
                    if (upsertedWorkPlan) {
                        if (upsertedWorkPlan["order"]) {
                            upsertedWorkPlan["orderId"] = upsertedWorkPlan["order"].id;
                            upsertedWorkPlan["orderNo"] = upsertedWorkPlan["order"].no;
                        }
                        if (upsertedWorkPlan["recipe"]) {
                            upsertedWorkPlan["recipeId"] = upsertedWorkPlan["recipe"].id;
                            upsertedWorkPlan["recipeNo"] = upsertedWorkPlan["recipe"].no;
                        }
                        if (upsertedWorkPlan["pickupTarget"]) {
                            upsertedWorkPlan["pickupTargetId"] = upsertedWorkPlan["pickupTarget"].id;
                            upsertedWorkPlan["pickupTargetNo"] = upsertedWorkPlan["pickupTarget"].no;
                        }

                        for (let i = 0; i < this.workPlans.length; i++) {
                            if (this.workPlans[i].id === upsertedWorkPlan.id) {
                                this.workPlans[i] = upsertedWorkPlan;
                            }
                        }
                        if (!this.workPlans.find(x => x.id === upsertedWorkPlan.id)) this.workPlans.push(upsertedWorkPlan);

                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.workPlanStore$.pipe(select(workPlanReducers.workPlansListTemplete_removeId)).subscribe((removedId: string) => {

                if (this.workPlans.find(x => x.id === removedId)) this.resultCount--;
                this.workPlans = this.workPlans.filter(x => x.id !== removedId);
            })
        );
    }

    goToWorkPlan(workPlanId: string) {
        this.router.navigate([`workPlans/${workPlanId}`]);
    }

    editWorkPlan(workPlan: Inventory) {
        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.editWorkPlan({ workPlan }));
    }

    filterWorkPlans(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getWorkPlans(): Promise<Inventory[]> {
        if (this.workPlansSubscription) this.workPlansSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.workPlansSubscription = this.workPlanStore$.pipe(
                select(workPlanReducers.getWorkPlans()),
                filter(x => x.loaded)
            ).subscribe(result => {
                this.resultCount = result.count;
                this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                this.anyLike = result.anyLike;
                resolve(result.workPlans);
            });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.workPlanStore$.dispatch(WorkPlansListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.workPlans = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    delete(workPlan: Inventory) {
        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.remove({ workPlan }));
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreWorkPlans = await this.getWorkPlans();
        if (moreWorkPlans.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreWorkPlans.forEach(workPlan => {
                if (!this.workPlans.find(x => x.id === workPlan.id)) this.workPlans.push({ ...workPlan });
            });
            for (let i = (this.workPlans.length - moreWorkPlans.length); i < this.workPlans.length; i++) {
                this.inventoriesService.findDetails(this.workPlans[i].id).toPromise().then((details: Inventory) => {
                    let workPlan = {
                        ...this.workPlans[i], ...details
                    };
                    
                    if (this.workPlans[i]) {
                        if (this.workPlans[i].id === workPlan.id) {
                            this.workPlans[i] = workPlan;
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

    more(workPlan: Inventory) {
        
        this.selectedWorkPlan = { ...workPlan };
        this.selectedWorkPlan._take = 0;
        this.hoverId = this.selectedWorkPlan.id;

        let buttons = [
            {
                color: "blue",
                title: "編輯",
                action: WorkPlansListTempleteActions.editWorkPlan,
                params: {
                    workPlan: { ...this.selectedWorkPlan }
                }
            },
            {
                color: "red",
                title: "刪除",
                action: WorkPlansListTempleteActions.remove,
                params: {
                    workPlan: { ...this.selectedWorkPlan }
                }
            }
        ]


        this.workPlanStore$.dispatch(WorkPlansListTempleteActions.more({ buttons }));
    }
}