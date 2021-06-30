import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
import { Inventory, Segmentation } from "@entities/inventory";
import { Subscription } from "rxjs";
import { Position } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { Location } from "@angular/common";
import { Grid } from "@models/app.model";

@Component({
    selector: "inventoryPickups",
    templateUrl: "page.html",
    styleUrls: ["page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class InventoriesPickupPage implements OnInit {
    inventoryGrids: Grid[];
    inventoriesSum: number;
    inventoriesUnit: string;
    inventoriesSubscription: Subscription;
    action: string;
    actionSubscription: Subscription;

    activatedRouteSubscription: Subscription;
    constructor(
        public activatedRoute: ActivatedRoute,
        public location: Location,
        private router: Router,
        private inventoriesService: InventoriesService,
        private appService: AppService,
        private positionsService: PositionsService,
        public store: Store<reducers.State>,
        private segmentationsService: SegmentationsService) { }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
    }

    async ngOnInit() {
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = this.activatedRoute.snapshot.url[1].path;
            this.appService.action$.next("預覽");
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe((action: string) => {
                this.action = action;

                switch (this.action) {
                    case "上頁":
                        this.appService.action$.next("提領內容物");
                        this.router.navigate([`./inventories/${this.appService.id}`]);
                        break;
                    case "確認提領":
                        let promises = new Array<Promise<any>>();
                        for (let inventoryGrid of this.inventoryGrids) {
                            let position = new Position();
                            position.targetId = this.appService.profile.id;

                            if (parseInt(inventoryGrid._value) === parseInt(inventoryGrid.value)) {
                                position.ownerId = inventoryGrid.id;
                                promises.push(this.positionsService.create(position).toPromise());
                            }
                            else {
                                let newInventory = new Inventory();
                                newInventory.itemId = inventoryGrid._accordion.id;
                                newInventory.value = inventoryGrid._value;
                                promises.push(
                                    new Promise(resolve => {
                                        this.segmentationsService.count({ ownerId: inventoryGrid.id }, false).subscribe((count: number) => {
                                            newInventory.no = inventoryGrid.key + "." + (count + 1).toString();
                                            this.inventoriesService.create(newInventory).subscribe((createdInventory: Inventory) => {
                                                let segmentation = new Segmentation(inventoryGrid.id, newInventory.id);
                                                segmentation.quantity = newInventory.value;
                                                position.ownerId = createdInventory.id;
                                                position.owner = null;
                                                let ps2 = [];
                                                ps2.push(this.positionsService.create(position).toPromise());
                                                ps2.push(this.segmentationsService.create(segmentation).toPromise());
                                                Promise.all(ps2).then(() => {
                                                    resolve();
                                                });
                                            });
                                        });
                                    })
                                );
                            }
                        }
                        Promise.all(promises).then(() => {
                            this.appService.inventories$.next([]);
                            this.appService.action$.next("載具刷新");
                            this.router.navigate([`./inventories/${this.appService.id}`]);
                        });
                        break;
                    case "預覽":
                        let bottom = this.appService.bottom$.getValue() || {};
                        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                        this.store.dispatch(LayoutActions.setTopTitle({ title: "確認提領內容" }));
                        this.store.dispatch(LayoutActions.setTopRight({ right: "空白" })); 
                        bottom.type = "action";
                        bottom.action = "確認提領內容";
                        this.appService.bottom$.next(bottom);
                        break;
                    default:
                        break;
                }
            });
        });

        this.inventoriesSubscription = this.appService.inventories$.subscribe((inventoryGrids: Grid[]) => {

            if (inventoryGrids && inventoryGrids.length > 0) {
                this.inventoryGrids = inventoryGrids;
                this.inventoriesSum = 0;
                this.inventoriesUnit = "";
                for (let inventoryGrid of this.inventoryGrids) {
                    this.inventoriesSum += parseInt(inventoryGrid._value);
                    if (this.inventoriesUnit.search(inventoryGrid.description) === -1)
                        this.inventoriesUnit += "/" + inventoryGrid.description;
                }
                if (this.inventoriesUnit.search("/") !== -1) this.inventoriesUnit = this.inventoriesUnit.substring(1);
            } else {
                this.appService.action$.next("預覽");
                this.router.navigate([`./inventories/${this.appService.id}`]);
            }
        });
    }
}