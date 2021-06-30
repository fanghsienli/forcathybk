import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router"; 
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import { DialogService } from "@services/dialog.service";
import { OptionsService } from "@services/options.service";
import * as XLSX from "xlsx";
import { ItemAttribute, Item } from "@entities/item";
import { Store, select } from "@ngrx/store";
import * as itemReducers from "@reducers/item";
import { ItemAttributesListTempleteActions } from "@actions/item";
import { filter, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ItemsService } from "@services/items.service";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { Inventory } from "@entities/inventory";
import { Category } from "@entities/category";

@Component({
    selector: "itemAttributesListTemplete",
    templateUrl: "itemAttributes.list.templete.html",
    styleUrls: ["itemAttributes.list.templete.css"]
})
export class ItemAttributesListTemplete implements OnInit {
    action: string;
    actionSubscription: Subscription;
    itemAttributesSubscription: Subscription;
    params: any;
    id: string;
    @ViewChild("exportTable") exportTable: ElementRef;
    loading: boolean;
    idChangeSubscription: Subscription;
    activatedRouteSubscription: Subscription;
    @Input() attributeEditTempletes$: BehaviorSubject<string[]>;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    categoryId$: Observable<string>;
    itemAttributes$: Observable<ItemAttribute[]>;
    loading$: Observable<boolean>;
    error$: Observable<string>;
    maxPage: number = 0;
    orderBy: any;
    descending: boolean;
    pageIndex: number = 0;
    pageSize: number = 50;
    itemAttributes: ItemAttribute[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    constructor(
        private router: Router,
        private inventoriesService: InventoriesService,
        private categoriesService: CategoriesService,
        public dialogService: DialogService,
        public activatedRoute: ActivatedRoute,
        public optionsService: OptionsService,
        public appService: AppService,
        public itemsService: ItemsService,
        private store: Store<itemReducers.State>) {
        this.setPageSize();
        this.itemAttributes = new Array<ItemAttribute>();
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) {
            this.descending = this.descending ? false : true;
        }
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.store.dispatch(ItemAttributesListTempleteActions.setSort({ orderBy: this.orderBy, descending: this.descending }));
        this.reLoad(1);
    }

    more(itemAttribute: ItemAttribute) {
        let presentation = {
            title: "more",
            buttons: [
                {
                    color: "blue",
                    title: "編輯",
                    action: "editItemAttribute",
                    params: { itemAttribute }
                },
                {
                    color: "red",
                    title: "刪除",
                    action: "removeItemAttribute",
                    params: { itemAttribute }
                }
            ]
        };

        presentation.buttons = presentation.buttons.map(button => {
            button.action = ItemAttributesListTempleteActions[button.action];
            return button;
        });
        let buttons = presentation.buttons;
        this.store.dispatch(ItemAttributesListTempleteActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }

    removeItemAttribute(itemAttribute: ItemAttribute) {
        this.store.dispatch(ItemAttributesListTempleteActions.removeItemAttribute({ itemAttribute }));
    }

    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.itemAttributesSubscription) this.itemAttributesSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
    }
    setPageSize() {
        this.store.dispatch(ItemAttributesListTempleteActions.setPageSize({
            pageSize: this.pageSize
        }));
    }

    append(itemAttribute: ItemAttribute): Promise<ItemAttribute> {
        return new Promise((resolve) => {
            itemAttribute._conditions = [];
            let promises = [];

            if (itemAttribute.target.itemIds) {
                
                let itemIds = itemAttribute.target.itemIds.split(",");
                itemIds.forEach((itemId: string) => {
                    promises.push(
                        new Promise((resolve) => {
                            this.itemsService.find(itemId).toPromise().then((item: Item) => {
                                let condition = {
                                    id: item.id,
                                    value: item.value,
                                    desc: item.code,
                                    type: "item"
                                };
                                if (!itemAttribute._conditions.find(x => x.id === condition.id)) {
                                    itemAttribute._conditions.push(condition);
                                }
                                resolve();
                            });
                        })
                    );
                });
            }
            if (itemAttribute.target.categoryIds) {
                let categoryIds = itemAttribute.target.categoryIds.split(",");
                categoryIds.forEach((categoryId: string) => {
                    promises.push(
                        new Promise((resolve) => {
                            this.categoriesService.find(categoryId).toPromise().then((category: Category) => {
                                let condition = {
                                    id: category.id,
                                    value: "#"+category.value,
                                    desc: "",
                                    type: "category"
                                };
                                if (!itemAttribute._conditions.find(x => x.id === condition.id)) {
                                    itemAttribute._conditions.push(condition);
                                }
                                resolve();
                            });
                        })
                    );
                });
            }
            if (itemAttribute.target.inventoryIds) {
                let inventoryIds = itemAttribute.target.inventoryIds.split(",");
                inventoryIds.forEach((inventoryId: string) => {
                    promises.push(
                        new Promise((resolve) => {
                            this.inventoriesService.find(inventoryId).toPromise().then((inventory: Inventory) => {
                                let condition = {
                                    id: inventory.id,
                                    value: inventory.no,
                                    desc: "",
                                    type: "inventory"
                                };
                                if (!itemAttribute._conditions.find(x => x.id === condition.id)) {
                                    itemAttribute._conditions.push(condition);
                                }
                                resolve();
                            });
                        })
                    );
                });
            }
            Promise.all(promises).then(() => {
                console.log(itemAttribute);
                resolve(itemAttribute);
            });
        });
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.store.dispatch(ItemAttributesListTempleteActions.setFilter({ anyLike: anyLike }));
            this.reLoad(1);
        });

        //當新增修改時
        this.ngOnInitSubscription.add(
            this.store.pipe(select(itemReducers.itemAttributesListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
                this.idChangeSubscription = this.store.pipe(
                    select(itemReducers.itemAttributesListTemplete_itemAttribute(), {
                        id: upsertId
                    })
                ).subscribe(async (itemAttribute: ItemAttribute) => {
                    if (itemAttribute) {
                        let appendedItemAttribute = await this.append({ ...itemAttribute });
                        if (appendedItemAttribute) {

                             for (let i = 0; i < this.itemAttributes.length; i++) {
                                 if (this.itemAttributes[i].id === appendedItemAttribute.id) {
                                     this.itemAttributes[i] = appendedItemAttribute;
                                 } 
                            }
                            if (!this.itemAttributes.find(x => x.id === appendedItemAttribute.id)) this.itemAttributes.push(appendedItemAttribute);
                        }
                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.store.pipe(select(itemReducers.itemAttributesListTemplete_removeId)).subscribe((removedId: string) => {
                if (this.itemAttributes.find(x => x.id === removedId)) this.resultCount--;
                this.itemAttributes = this.itemAttributes.filter(x => x.id !== removedId);
            })
        );

        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            this.params = { statusId: "005617b3-d283-461c-abef-5c0c16c780d0" };
            this.appService.action$.next("預覽");
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
    }

    goToItem(itemId: string) {

        this.router.navigate([`items/${itemId}`]);
    }

    openItem(itemId: string) {
        window.open(`items/${itemId}`);
    }

    openCategory(categoryId: string) {
        window.open(`categories/${categoryId}`);
    }

    openInventory(inventoryId: string) {
        window.open(`inventories/${inventoryId}`);
    }

    Attribute() {
        this.store.dispatch(ItemAttributesListTempleteActions.Attribute());
        this.appService.presentation$.next({});
    }

    editItemAttribute(itemAttribute: ItemAttribute) {
        this.store.dispatch(ItemAttributesListTempleteActions.editItemAttribute({ itemAttribute }));
        this.appService.presentation$.next({});
    }

    filterItemAttributes(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getItemAttributes(): Promise<ItemAttribute[]> {
        if (this.itemAttributesSubscription) this.itemAttributesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.itemAttributesSubscription = this.store.pipe(
                select(itemReducers.itemAttributesListTemplete_itemAttributes(), {
                    pageIndex: this.pageIndex,
                    descending: this.descending
                }), filter(x => x.loaded)).subscribe(result => {
                    this.resultCount = result.count;
                    this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                    this.anyLike = result.anyLike;
                    resolve(result.itemAttributes);
                });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.itemAttributes = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreItemAttributes = await this.getItemAttributes();

        if (moreItemAttributes.length > 0) {
            moreItemAttributes.forEach((itemAttribute: ItemAttribute) => {
                this.itemAttributes.push(itemAttribute);
            });
            for (let i = 0; i < this.itemAttributes.length; i++) {
                let appendedItemAttribute = await this.append({ ...this.itemAttributes[i] });
                for (let i = 0; i < this.itemAttributes.length; i++) {
                        if (this.itemAttributes[i].id === appendedItemAttribute.id) {
                            this.itemAttributes[i] = appendedItemAttribute;
                        }
                }
            }
            window.scrollBy(0, -60 * moreItemAttributes.length);
            setTimeout(() => {
                this.loading = false;
            }, debounceTime);
        } else setTimeout(() => {
            this.loading = false;
        }, debounceTime);
    }
}