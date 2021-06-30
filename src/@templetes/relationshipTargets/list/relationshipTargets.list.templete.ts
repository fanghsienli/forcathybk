import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Position, Inventory, Segmentation } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { Gen } from "@entities/entity";
import { RelationshipTargetsListTempleteActions } from "@actions/relationshipTarget";
import { Store, select } from "@ngrx/store";
import * as relationshipTargetReducers from "@reducers/relationshipTarget";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Attribute } from "@entities/attribute";
@Component({
    selector: "relationshipTargetsListTemplete",
    templateUrl: "relationshipTargets.list.templete.html",
    styleUrls: ["relationshipTargets.list.templete.css"]
})
export class RelationshipTargetsListTemplete implements OnInit {
    hoverId: string;
    action: string;
    idChangeSubscription: Subscription;
    actionSubscription: Subscription;
    relationshipTargetsSubscription: Subscription;
    @ViewChild("exportTable") exportTable: ElementRef;
    activatedRouteSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    loading$: Observable<boolean>;
    @Input() checkedAttributes: Attribute[];
    maxPage: number = 1;
    orderBy: any;
    descending: boolean;
    loading: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 15;
    relationshipTargets: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedRelationshipTarget: Inventory;
    presentationSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public relationshipTargetsService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private relationshipTargetStore: Store<relationshipTargetReducers.State>,
        private attributeStroe: Store<attributeReducers.State>) {
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.relationshipTargetStore.select(relationshipTargetReducers.relationshipTargetsListTemplete_total);
        this.relationshipTargets = new Array<Inventory>();
    }
 ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setFilter({ anyLike: anyLike }));
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
            this.relationshipTargetStore.pipe(select(relationshipTargetReducers.relationshipTargetsListTemplete_ids)).subscribe((ids: string[]) => {
                this.reLoad(1);
            })
        );

        //當新增修改時
        this.ngOnInitSubscription.add(
            this.relationshipTargetStore.pipe(select(relationshipTargetReducers.relationshipTargetsListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
                this.idChangeSubscription = this.relationshipTargetStore.pipe(
                    select(relationshipTargetReducers.relationshipTargetEntities_find(), {
                        id: upsertId
                    })
                ).subscribe(async (relationshipTarget: Inventory) => {
                    
                    if (relationshipTarget) {
                        for (let i = 0; i < this.relationshipTargets.length; i++) {
                            if (this.relationshipTargets[i].id === relationshipTarget.id) {
                                this.relationshipTargets[i] = { ...this.relationshipTargets[i], ...relationshipTarget };
                            }
                        }
                        if (!this.relationshipTargets.find(x => x.id === relationshipTarget.id)) this.relationshipTargets.push(relationshipTarget);
                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.relationshipTargetStore.pipe(select(relationshipTargetReducers.relationshipTargetsListTemplete_removeId)).subscribe((removedId: string) => {
                if (this.relationshipTargets.find(x => x.id === removedId)) this.resultCount--;
                this.relationshipTargets = this.relationshipTargets.filter(x => x.id !== removedId);
            })
        );

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            if (presentation && presentation.relationshipTarget) {
                let relationshipTarget: Inventory = presentation.relationshipTarget;
                let position = new Position();
                position.targetId = this.appService.profile.id;
                if (presentation.action === "全部提領(list)" || relationshipTarget._take === relationshipTarget.value) {
                    position.ownerId = presentation.relationshipTarget.id;
                    this.positionsService.create(position).subscribe(async (position: Position) => {
                        this.appService.presentation$.next(null);
                        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setSort({
                            orderBy: this.orderBy,
                            descending: this.descending
                        }));
                        this.reLoad(1);
                        this.appService.message$.next(`已移動${relationshipTarget.no}至您的載具中!`);
                    });
                } else {
                    if (presentation.action === "提領(list)") { //提領                        
                        let newRelationshipTarget = new Inventory();
                        newRelationshipTarget.itemId = relationshipTarget.itemId;
                        newRelationshipTarget.value = relationshipTarget._take;
                        this.segmentationsService.count({ ownerId: relationshipTarget.id }, false).subscribe((count: number) => {
                            newRelationshipTarget.no = `${relationshipTarget.no.split("_")[0]}_${Gen.newNo()}`;
                            this.relationshipTargetsService.create(newRelationshipTarget).subscribe((createdRelationshipTarget: Inventory) => {
                                let segmentation = new Segmentation(relationshipTarget.id, newRelationshipTarget.id);
                                segmentation.quantity = newRelationshipTarget.value;
                                position.ownerId = createdRelationshipTarget.id;
                                position.owner = null;
                                let promises = new Array<Promise<any>>();
                                promises.push(this.positionsService.create(position).toPromise());
                                promises.push(this.segmentationsService.create(segmentation).toPromise());
                                Promise.all(promises).then(async () => {
                                    this.appService.presentation$.next(null);
                                    this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setSort({
                                        orderBy: this.orderBy,
                                        descending: this.descending
                                    }));
                                    this.reLoad(1);
                                    relationshipTarget.itemValue = relationshipTarget.itemValue || "不明品項";
                                    this.appService.message$.next(`已提領${relationshipTarget.no}內${relationshipTarget._take}單位的${relationshipTarget.itemValue}單位至您的載具中!`);
                                });
                            });
                        });
                    }
                }
            }
            else {
                switch (presentation) {
                    case "取消":
                        this.appService.presentation$.next(null);
                        this.appService.action$.next("預覽");
                        break;
                    default:
                        break;
                }
            }
        });
    }
    newRelationshipTarget() {
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.newRelationshipTarget());
        this.appService.presentation$.next({});
    }

    typeOf(any: any) {
        if (typeof any === "object") return Object.prototype.toString.call(any);
        return typeof any;
    }

    openRelationshipTarget(relationshipTargetId: string) {
        window.open(`relationshipTargets/${relationshipTargetId}`);
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) this.descending = this.descending ? false : true;
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setSort({
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
        if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.relationshipTargetsSubscription) this.relationshipTargetsSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
    }

   

    goToInventory(inventoryId: string) {
        this.router.navigate([`inventories/${inventoryId}`]);
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }
    editRelationshipTarget(relationshipTarget: Inventory) {
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.editRelationshipTarget({ relationshipTarget }));
        this.appService.presentation$.next({});
    }

    filterRelationshipTargets(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getRelationshipTargets(): Promise<Inventory[]> {
        if (this.relationshipTargetsSubscription) this.relationshipTargetsSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.relationshipTargetsSubscription = this.relationshipTargetStore.pipe(
                select(relationshipTargetReducers.getRelationshipTargets(), {
                    pageIndex: this.pageIndex,
                    descending: this.descending
                })).subscribe(result => {
                    if (result.loaded) {
                        this.resultCount = result.count;
                        this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                        this.anyLike = result.anyLike;
                        resolve(result.relationshipTargets);
                    }
                });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.relationshipTargets = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }
    delete(relationshipTarget: Inventory) {
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.remove({ relationshipTarget }));
    }
    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreRelationshipTargets = await this.getRelationshipTargets();
        if (moreRelationshipTargets.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreRelationshipTargets.forEach(relationshipTarget => {
                this.relationshipTargets = this.relationshipTargets.filter(x => x.id !== relationshipTarget.id);
                 this.relationshipTargets.push({ ...relationshipTarget });
            });
            for (let i = (this.relationshipTargets.length - moreRelationshipTargets.length); i < this.relationshipTargets.length; i++) {
                this.relationshipTargetsService.findDetails(this.relationshipTargets[i].id).toPromise().then((details: Inventory) => {

                    let relationshipTarget = {
                        ...this.relationshipTargets[i], ...details
                    };
                    console.log(relationshipTarget);
                    if (this.relationshipTargets[i]) {
                        if (this.relationshipTargets[i].id === relationshipTarget.id) {
                            this.relationshipTargets[i] = relationshipTarget;
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

    more(relationshipTarget: Inventory) {
        this.selectedRelationshipTarget = { ...relationshipTarget };
        this.hoverId = this.selectedRelationshipTarget.id;
        let presentation = {
            title: "more",
            buttons: [
                {
                    color: "blue",
                    title: "編輯",
                    action: "editRelationshipTarget",
                    params: {
                       relationshipTarget: { ...this.selectedRelationshipTarget }
                    }
                },
                {
                    color: "red",
                    title: "刪除",
                    action: "remove",
                    params: {
                        relationshipTarget: { ...this.selectedRelationshipTarget }
                    }
                }
            ]
        };

        presentation.buttons = presentation.buttons.map(button => {
            button.action = RelationshipTargetsListTempleteActions[button.action];
            return button;
        });
        let buttons = presentation.buttons;
        this.relationshipTargetStore.dispatch(RelationshipTargetsListTempleteActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }


    pickup(relationshipTarget) {
        this.appService.presentation$.next({ relationshipTarget: relationshipTarget, action: "直接提領(list)" });
    }
}