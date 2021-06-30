import { Component, OnInit, HostBinding } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { InventoriesService } from "@services/inventories.service";
import { FolderFile, File, Option, Gen } from "@entities/entity";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Inventory } from "@entities/inventory";
import { InventorySave } from "@models/inventory";
import { FileSave } from "@models/entity";
import { Item } from "@entities/item";
import { Category } from "@entities/category";
import { OptionsService } from "@services/options.service";
import { ItemsService } from "@services/items.service";
import { ItemSave } from "@models/item";
import { CategoriesService } from "@services/categories.service";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
@Component({
    selector: "inventoryEditPage",
    templateUrl: "inventory.edit.page.html",
    styleUrls: ["inventory.edit.page.css"],
    host: { "class": "SCxLW", "role": "main", "style": "margin-bottom:8px" }
})
export class InventoryEditPage implements OnInit {
    id: string;
    urlAction: string;
    @HostBinding("class.uzKWK") uzKWK: boolean = false;
    inventorySave: InventorySave;
    itemSave: ItemSave;
    categoryValues: string[];
    mainPhoto: File;
    folderFiles: FolderFile[] = new Array<FolderFile>();
    action: any;
    actionSubscription: Subscription;
    loading: boolean;
    top: any;
    topSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    inventoriesSubscription: Subscription;
    inventoriesSubscription2: Subscription;
    activatedRouteSubscription: Subscription;
    newRecipe: boolean;
    item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(new Item());
    item: Item;
    inventory$: BehaviorSubject<Inventory> = new BehaviorSubject<Inventory>(null);
    inventory: Inventory;
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public folderFilesService: FolderFilesService,
        public itemsService: ItemsService,
        public optionsService: OptionsService,
        public store: Store<reducers.State>,
        public categoriesService: CategoriesService
    ) {
        this.loading = true;
        if (!this.appService.mobile) this.uzKWK = true;
    }

    ngOnDestroy() {
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.topSubscription) this.topSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.inventoriesSubscription2) this.inventoriesSubscription2.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    getItem(id): Promise<Item> {
        return new Promise((resolve) => {
            this.itemsService.find(id).toPromise().then((item: Item) => {
                resolve(item);
            });
        });
    }

    getInventory(): Promise<Inventory> {
        return new Promise((resolve) => {
            this.inventoriesService.find(this.appService.id).toPromise().then(async (inventory: Inventory) => {
                if (inventory.itemId) {
               this.appService.item$.next(inventory.item);
                    inventory.item = await this.getItem(inventory.itemId);
                    if (!inventory.no) {
                        inventory.no = `${inventory.item.code}_${Gen.newNo()}`;
                    }
                }
                this.loading = false;
                resolve(inventory);
            });
        });
    }

    nextAction(action: string) {
        this.appService.action$.next(action);
    }

    ngOnInit() { 
        this.store.dispatch(LayoutActions.setTopLeft({ left: "取消" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "待發佈存量" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "繼續" })); 
        this.appService.bottom$.next(null);
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.errors$.next([]);
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = this.activatedRoute.snapshot.url[1].path;
            this.inventory = await this.getInventory();
            this.appService.inventory$.next(this.inventory);
            this.inventory$.next(this.inventory);
            this.appService.item$.next(this.inventory.item);
            this.item$.next(this.inventory.item);
            
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (this.appService.module === "inventories") {
                    this.action = action;
                    switch (this.action) {
                        case "取消":
                            if (this.appService.errors$.getValue().length === 0) this.save().then(() => { this.appService.message$.next("儲存草稿完成"); });
                            this.appService.presentation$.next(null);
                            this.appService.action$.next("上頁");
                            break;
                        case "更新":
                            this.submit().then(() => {
                                this.appService.presentation$.next(null);
                                this.appService.message$.next("更新存量成功");
                                this.appService.action$.next("上頁");
                            });
                            break;
                        case "發佈":
                            this.submit().then(() => {
                                this.appService.presentation$.next(null);
                                this.appService.message$.next("發佈存量成功");
                                this.appService.action$.next("上頁");
                            });
                            break;
                        case "預覽":
                            let itemValue = this.appService.item$.getValue() ? this.appService.item$.getValue().value : "";
                            if (!this.inventory.statusId) this.inventory.statusId = "";
                            switch (this.inventory.statusId) {
                                case "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5": 
                                    this.store.dispatch(LayoutActions.setTopLeft({ left: "取消" }));
                                    this.store.dispatch(LayoutActions.setTopTitle({ title: `待發佈${itemValue}存量` }));
                                    this.store.dispatch(LayoutActions.setTopRight({ right: "發佈" })); 
                                    break;
                                case "005617b3-d283-461c-abef-5c0c16c780d0": 
                                    this.store.dispatch(LayoutActions.setTopLeft({ left: "取消" }));
                                    this.store.dispatch(LayoutActions.setTopTitle({ title: `編輯${itemValue}存量` }));
                                    this.store.dispatch(LayoutActions.setTopRight({ right: "更新" })); 
                                    break;
                                default: 
                                    this.store.dispatch(LayoutActions.setTopLeft({ left: "取消" }));
                                    this.store.dispatch(LayoutActions.setTopTitle({ title: "新增存量" }));
                                    this.store.dispatch(LayoutActions.setTopRight({ right: "發佈" })); 
                            }
                        default:
                            break;
                    }
                }
            });
        });
    }

    createInventoryPhoto(event) {
        if (event.target.files) {
            let inventory = this.inventory$.getValue();
            this.filesService.create(<Array<File>>event.target.files, "inventories/" + inventory.id).subscribe((fileSave: FileSave) => {
                inventory.photoId = fileSave.photos[0].id;
                inventory.photo = fileSave.photos[0];
                this.inventory$.next(inventory);
            });
        }
    }

    submit() {
        this.appService.presentation$.next({ action: "訊息", h3: "發佈中", div: "存量發佈中, 請稍後..." });
        return new Promise((resolve) => {
            this.inventory = this.inventory$.getValue();
            this.item = this.item$.getValue();
            if (this.isNewItem()) {
                let promises = [];
                let categoryValues = {};

                this.item.description.split("#").map(x => x.trim()).filter(x => x !== "").forEach(categoryValue => {
                    categoryValues[categoryValue] = categoryValue;
                });

                for (let categoryValue in categoryValues) {
                    let category = new Category();
                    category.value = categoryValue;
                    promises.push(
                        new Promise<number>((resolve) => this.categoriesService.create(category).toPromise().then(
                            () => resolve(1)
                        )
                        )
                    );
                }
                Promise.all(promises).then(categorySuccesses => {
                    this.item.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
                    this.item.photoId = this.inventory.photoId;
                    this.itemsService.create(this.item).subscribe((createdItem: Item) => {
                        this.item = createdItem;
                        this.inventory.itemId = this.item.id;
                        this.inventory.statusId = "005617b3-d283-461c-abef-5c0c16c780d0";
                        this.inventoriesService.update(this.inventory.id, this.inventory).toPromise().then((updatedInventory: Inventory) => {
                            resolve(updatedInventory);
                        });
                    });
                });

            } else {
                this.inventory.itemId = this.item$.getValue().id;
                this.inventory.statusId = "005617b3-d283-461c-abef-5c0c16c780d0";
                this.inventoriesService.update(this.inventory.id, this.inventory).toPromise().then((updatedInventory: Inventory) => {
                    resolve(updatedInventory);
                });
            }
        });
    }

    save() {
        this.appService.presentation$.next({ action: "訊息", h3: "儲存草稿中", div: "存量儲存草稿中, 請稍後..." });
        return new Promise((resolve) => {
            this.inventory = this.inventory$.getValue();
            this.item = this.item$.getValue();
            if (this.isNewItem()) {
                let promises = [];
                let categoryValues = {};

                this.item.description.split("#").map(x => x.trim()).filter(x => x !== "").forEach(categoryValue => {
                    categoryValues[categoryValue] = categoryValue;
                });
                let categoryValueCount: number = 0;
                for (let categoryValue in categoryValues) {
                    let category = new Category();
                    category.value = categoryValue;
                    categoryValueCount++;
                    promises.push(
                        new Promise<number>((resolve) => this.categoriesService.create(category).toPromise().then(
                            () => resolve(1),
                            () => {
                                let err = `#${category.value}新增失敗!`;
                                alert(err);
                            })
                        )
                    );
                }
                Promise.all(promises).then(categorySuccesses => {
                    setTimeout(() => {
                        this.item.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
                        this.item.photoId = this.inventory.photoId;
                        this.itemsService.create(this.item).subscribe((createdItem: Item) => {
                            this.item = createdItem;
                            this.inventory.itemId = this.item.id;
                            this.inventory.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
                            this.inventoriesService.update(this.inventory.id, this.inventory).toPromise().then((updatedInventory: Inventory) => {
                                resolve(updatedInventory);
                            });
                        });
                    }, 200);
                });
            } else {
                this.inventory.itemId = this.item.id;
                this.inventory.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
                this.inventoriesService.update(this.inventory.id, this.inventory).toPromise().then((updatedInventory: Inventory) => {
                    resolve(updatedInventory);
                });
            }
        });
    }

    isNewItem() {

        let item = this.item$.getValue();
        if (item) return (!item.createdById && item.value);
        else return false;
    }

    isNewInventory() {
        let inventory = this.inventory$.getValue();
        return (!inventory.createdById && inventory.value);
    }

    hasItem() {
        let item = this.item$.getValue();
        return item.value;
    }
}
