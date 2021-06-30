import { Component, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "@services/app.service";
import { Inventory, Position } from "@entities/inventory";
import { Item } from "@entities/item";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FilesService } from "@services/files.service";
import { ItemsService } from "@services/items.service";
import { InventoriesService } from "@services/inventories.service";
import { Location } from "@angular/common";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
@Component({
    selector: "bottomNav",
    templateUrl: "bottomNav.component.html",
    styleUrls: ["bottomNav.component.css"],
    host: { "class": "NXc7H f11OC"}
})
export class BottomNavComponent implements OnInit {
    @Input() bottom: any;
    walletCount: number;
    
    action: string;
    activatedRouteSubscription: Subscription;
    walletCountSubscription: Subscription;
    actionSubscription: Subscription;
    show: boolean;
    constructor(
        public router: Router,
        public store: Store<reducers.State>,
        public activatedRoute: ActivatedRoute,
        private appService: AppService,
        public filesService: FilesService,
        public itemsService: ItemsService,
        public location: Location,
        public inventoriesService: InventoriesService) { 
    }

    ngOnDestroy() {
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.walletCountSubscription) this.walletCountSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
    }
    getWalletCount(): Promise<number> {
        return new Promise((resolve) => {
            this.walletCount = null;
            this.show = false;
            this.walletCountSubscription = this.inventoriesService.getCount(this.appService.profile.id).subscribe((count: number) => {
                setTimeout(() => { this.show = true; }, 300);
                resolve(count);
            });
        });
    }
    async ngOnInit() {
        this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
            if (this.appService.module === "inventories" && action === "載具刷新") {
                this.action = action;                
                switch (this.action) {                  
                    case "載具刷新":                        
                        this.walletCount = await this.getWalletCount();
                        break;               
                   default:
                        break;
                }
            }
        });
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (params) => { 
            this.walletCount = await this.getWalletCount();
        });
    }



    goTo(url: string) {
        if (url === "scan") {
            this.appService.qrcodeReader$.next(true);
        } else {
        this.appService.action$.next("預覽");
            this.router.navigate([url]);
        }
    }

    create() {
        let id = this.appService.id;
        let newInventory = new Inventory();
        newInventory.createdById = this.appService.profile.id; 
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            let newItem = new Item();
            newItem.createdById = this.appService.profile.id; 
            this.appService.action$.next("預覽");
            switch (this.appService.module) {
                case "categories": 
                    //if (top.title && top.title.search("#") !== -1) newItem.description = top.title;
                    this.itemsService.create(newItem).subscribe((createdItem: Item) => {
                        this.router.navigate([`items/${createdItem.id}/edit`]);
                    });
                    break;
                case "recipes":
                    newInventory.itemId = id;
                    newInventory.position = new Position();
                    newInventory.position.targetId = this.appService.profile.id;
                    this.inventoriesService.create(newInventory).subscribe((createdInventory: Inventory) => {
                        this.router.navigate([`inventories/${createdInventory.id}/edit`]);
                    });
                    break;
                case "inventories":
                    newInventory.position = new Position();
                    newInventory.position.targetId = id;
                    this.inventoriesService.create(newInventory).subscribe((createdInventory: Inventory) => {
                        this.router.navigate([`inventories/${createdInventory.id}/edit`]);
                    });
                    break;
                case "home":
                    this.appService.presentation$.next({
                        invoice: {
                            id: "",
                            date: "10",
                            price: "",
                            taxed: "",
                            buyer: "27799133",
                            seller: "",
                            error: false
                        }, action: "發票建檔"
                    }); 
                    break;
                default:
                    this.itemsService.create(newItem).subscribe((createdItem: Item) => {
                        this.appService.item$.next(createdItem);
                        this.router.navigate([`items/${createdItem.id}/edit`]);
                    });
                    break;
            }
        });
    }
}
