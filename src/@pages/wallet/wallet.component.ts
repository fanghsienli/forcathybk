import { Component, OnInit, HostBinding } from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Inventory, Segmentation } from "@entities/inventory";
import { Subscription } from "rxjs";
import { Position } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
import { Location } from "@angular/common";
import { Gen } from "@entities/entity";
import { PresentationActions } from '../../@actions';

@Component({
    selector: "wallet",
    templateUrl: "wallet.component.html",
    styleUrls: ["wallet.component.css"],
    host: { "class": "SCxLW" }
})
export class WalletComponent implements OnInit {
    activatedRouteSubscription: Subscription;
    inventories: Inventory[];
    selectedInventoriesSubscription: Subscription;
    inventoriesSubscription: Subscription;
    inventoriesSum: number;
    inventoriesUnit: string;
    inventory: Inventory;
    inventorySubscription: Subscription;
    result: string;
    resultSubscription: Subscription;
    action: string;
    actionSubscription: Subscription;
    @HostBinding("class.uzKWK") uzKWK: boolean = false;
    @HostBinding("class.paddingBottom") paddingBottom: boolean = false;
    presentationSubscription: Subscription;
    loading: boolean;
    constructor(
        public activatedRoute: ActivatedRoute,
        public location: Location,
        private router: Router,
        private inventoriesService: InventoriesService,
        private appService: AppService,
        public store: Store<reducers.State>,
        private positionsService: PositionsService,
        private segmentationsService: SegmentationsService) {
        this.inventories = new Array<Inventory>();
        this.loading = true;
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.selectedInventoriesSubscription) this.selectedInventoriesSubscription.unsubscribe();
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.inventorySubscription) this.inventorySubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
    }

    ngOnInit() {
        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "我的載具" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "空白" }));
        this.activatedRouteSubscription = this.activatedRoute.parent.url.subscribe((urlSegments: UrlSegment[]) => {
            this.appService.id = "";
            this.appService.module = urlSegments[0].path;
            this.appService.action = "";
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (this.appService.module === "wallet" && action) {
                    this.action = action;
                    let selectedInventories = this.appService.inventories$.getValue() || [];
                    switch (this.action) {
                        case "部分放置":
                            let presentation = {
                                inventory: this.appService.inventories$.getValue()[0],
                                action: "部分放置"
                            };
                            this.appService.presentation$.next(presentation);
                            this.store.dispatch(PresentationActions.open({ title: "putdown", width: "240px" }));
                            break;
                        case "預覽":
                            this.inventories = await this.getInventoryPutdowns();
                            this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                            this.store.dispatch(LayoutActions.setTopTitle({ title: "我的載具" }));
                            if (this.inventories.length > 0) {
                                this.store.dispatch(LayoutActions.setTopRight({ right: "全選" }));
                                if (selectedInventories.filter(x => x._select).length === this.inventories.length) {
                                    this.store.dispatch(LayoutActions.setTopRight({ right: "取消全選" }));
                                }
                            } else this.store.dispatch(LayoutActions.setTopRight({ right: "空白" }));
                            this.appService.inventories$.next(selectedInventories);
                            break;
                        case "全選":
                            for (let inventory of this.inventories) {
                                //  let selectedInventory = selectedInventories.find(x => x.id === selectedInventory.id);
                                inventory._select = true;
                                //  if (!selectedInventory) selectedInventories.push(inventory);
                                //  else selectedInventory = inventory;
                            }
                            this.store.dispatch(LayoutActions.setTopRight({ right: "取消全選" }));
                            this.appService.inventories$.next(this.inventories);
                            break;
                        case "取消全選":
                            for (let inventory of this.inventories) {
                                inventory._select = false;
                            }
                            this.store.dispatch(LayoutActions.setTopRight({ right: "全選" }));
                            this.appService.inventories$.next(this.inventories);
                            break;
                        case "放置":
                            this.store.dispatch(PresentationActions.close({ message: "" }));
                            this.appService.action$.next("掃碼");
                            this.appService.action$.next("等待放置結果");
                            break;
                        case "返回":
                            this.appService.action$.next("預覽");
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        this.selectedInventoriesSubscription = this.appService.inventories$.subscribe((inventories: Inventory[]) => {
            let selectedInventories = inventories.filter(x => x._select);
            let bottom = this.appService.bottom$.getValue() || {};
            if (inventories && inventories.length > 0) {
                if (selectedInventories.length === 0) {
                    bottom.type = "nav";
                    bottom.active = "載具";
                    this.paddingBottom = false;
                } else {
                    bottom.type = "action";
                    bottom.action = "放置";
                    this.paddingBottom = true;
                }

                if (this.inventories.length > 0) {
                    this.store.dispatch(LayoutActions.setTopRight({ right: "全選" }));
                    if (inventories.filter(x => x._select).length === this.inventories.length) {
                        this.store.dispatch(LayoutActions.setTopRight({ right: "取消全選" }));
                    }
                } else this.store.dispatch(LayoutActions.setTopRight({ right: "空白" }));
                this.appService.bottom$.next(bottom);
            } else {
                bottom.type = "nav";
                bottom.active = "載具";
                this.paddingBottom = false;
                this.appService.bottom$.next(bottom);
            }
        });

        this.resultSubscription = this.appService.result$.subscribe((result) => {
            if (this.appService.module === "wallet" && this.action === "等待放置結果") {

                this.appService.action$.next("預覽");
                this.appService.presentation$.next({ action: "訊息", h3: "放置中", div: "物品放置中, 請稍後..." });
                if (result.search("inventories") !== -1) {
                    let targetId = result.substr(12, 36);
                    let inventories: Inventory[] = this.appService.inventories$.getValue();
                    let promises = Array<Promise<any>>();
                    for (let inventory of inventories) {
                        let position = new Position();
                        position.target = null;
                        position.targetId = targetId;
                        if (inventory._take === inventory.value || inventory._select) {
                            position.ownerId = inventory.id;
                            promises.push(this.positionsService.create(position).toPromise());
                        } else {
                            let newInventory = new Inventory();
                            newInventory.itemId = inventory.itemId;
                            newInventory.value = inventory._take;
                            promises.push(new Promise(resolve => {
                                this.segmentationsService.count({ ownerId: inventory.id }, false).subscribe((count: number) => {
                                    newInventory.no = inventory.no.split("_")[0] + "_" + Gen.newNo();
                                    this.inventoriesService.create(newInventory).subscribe((createdInventory: Inventory) => {
                                        let segmentation = new Segmentation(inventory.id, newInventory.id);
                                        segmentation.quantity = newInventory.value;
                                        position.ownerId = createdInventory.id;
                                        position.owner = null;
                                        let promises2 = Array<Promise<any>>();
                                        promises2.push(this.positionsService.create(position).toPromise());
                                        promises2.push(this.segmentationsService.create(segmentation).toPromise());
                                        Promise.all(promises2).then(() => {
                                            resolve();
                                        });
                                    });
                                });
                            }));
                        }
                    }
                    Promise.all(promises).then(() => {
                        this.appService.result$.next("");
                        this.appService.inventories$.next([]);
                        this.appService.presentation$.next(null);
                        this.appService.message$.next("放置成功");
                        this.router.navigate([`./inventories/${targetId}`]);
                    });
                }
            }
        });

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {

            if (presentation && presentation.inventory && (presentation.action === "全部放置" || presentation.action === "放置")) {
                let inventories = [];
                inventories.push(presentation.inventory);
                this.appService.inventories$.next(inventories);
                this.appService.presentation$.next(null);
                this.appService.action$.next("放置");
            }
        });
    }

    getInventoryPutdowns(): Promise<Inventory[]> {
        this.loading = true;
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.inventoriesSubscription = this.inventoriesService.getPutdowns({
                inventoryId: this.appService.profile.id
            }).subscribe((inventories: Inventory[]) => {
                if (inventories.length > 0) this.uzKWK = true;
                else this.uzKWK = false;
                for (let inventory of inventories) {
                    inventory._take = 0;
                    inventory._take = 0;
                }
                this.loading = false;
                resolve(inventories);
            });
        });
    }
}