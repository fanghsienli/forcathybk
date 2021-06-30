import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import { DialogService } from "@services/dialog.service";
import { OptionsService } from "@services/options.service";
import * as XLSX from "xlsx";
import { InventoryAttribute } from "@entities/inventory";
import { Store, select } from "@ngrx/store";
import * as inventoryReducers from "@reducers/inventory";
import { InventoryAttributesListTempleteActions } from "@actions/inventory";
import { filter, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";

@Component({
    selector: "inventoryAttributesListTemplete",
    templateUrl: "inventoryAttributes.list.templete.html",
    styleUrls: ["inventoryAttributes.list.templete.css"]
})
export class InventoryAttributesListTemplete implements OnInit {
    action: string;
    actionSubscription: Subscription;
    inventoryAttributesSubscription: Subscription;
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
    inventoryAttributes$: Observable<InventoryAttribute[]>;
    loading$: Observable<boolean>;
    error$: Observable<string>;
    maxPage: number = 0;
    orderBy: any;
    descending: boolean;
    pageIndex: number = 0;
    pageSize: number = 50;
    inventoryAttributes: InventoryAttribute[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    constructor(
        private router: Router,
        public dialogService: DialogService,
        public activatedRoute: ActivatedRoute,
        public optionsService: OptionsService,
        public appService: AppService,
        private store: Store<inventoryReducers.State>) {
        this.setPageSize();
        this.inventoryAttributes = new Array<InventoryAttribute>();
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) {
            this.descending = this.descending ? false : true;
        }
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.store.dispatch(InventoryAttributesListTempleteActions.setSort({ orderBy: this.orderBy, descending: this.descending }));
        this.reLoad(1);
    }
    more(inventoryAttribute: InventoryAttribute) {
        let buttons = [
            {
                color: "blue",
                title: "編輯",
                action: InventoryAttributesListTempleteActions.edit,
                params: { inventoryAttribute }
            },
            {
                color: "red",
                title: "刪除",
                action: InventoryAttributesListTempleteActions.remove,
                params: { inventoryAttribute }
            }
        ];
        this.store.dispatch(InventoryAttributesListTempleteActions.more({ buttons }));
    }
    delete(inventoryAttribute: InventoryAttribute) {
        this.store.dispatch(InventoryAttributesListTempleteActions.remove({ inventoryAttribute }));
    }

    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.inventoryAttributesSubscription) this.inventoryAttributesSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
    }
    setPageSize() {
        this.store.dispatch(InventoryAttributesListTempleteActions.setPageSize({
            pageSize: this.pageSize
        }));
    }

    append(inventoryAttribute: InventoryAttribute): Promise<InventoryAttribute> {
        return new Promise((resolve) => {
            let promises = [];
            Promise.all(promises).then(() => {
                resolve(inventoryAttribute);
            });
        });
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.store.dispatch(InventoryAttributesListTempleteActions.setFilter({ anyLike: anyLike }));
            this.reLoad(1);
        });

        //當新增修改時
        this.ngOnInitSubscription.add(
            this.store.pipe(select(inventoryReducers.inventoryAttributesListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.idChangeSubscription) this.idChangeSubscription.unsubscribe();
                this.idChangeSubscription = this.store.pipe(
                    select(inventoryReducers.inventoryAttributesListTemplete_inventoryAttribute(), {
                        id: upsertId
                    })
                ).subscribe(async (inventoryAttribute: InventoryAttribute) => {
                    if (inventoryAttribute) {
                        let appendedInventoryAttribute = await this.append({ ...inventoryAttribute });
                        if (appendedInventoryAttribute) {

                            for (let i = 0; i < this.inventoryAttributes.length; i++) {
                                if (this.inventoryAttributes[i].id === appendedInventoryAttribute.id) {
                                    this.inventoryAttributes[i] = appendedInventoryAttribute;
                                }
                            }
                            if (!this.inventoryAttributes.find(x => x.id === appendedInventoryAttribute.id)) this.inventoryAttributes.push(appendedInventoryAttribute);
                        }
                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.store.pipe(select(inventoryReducers.inventoryAttributesListTemplete_removeId)).subscribe((removeId: string) => {
                if (this.inventoryAttributes.find(x => x.id === removeId)) this.resultCount--;
                this.inventoryAttributes = this.inventoryAttributes.filter(x => x.id !== removeId);
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

    goToInventory(inventoryId: string) {

        this.router.navigate([`inventories/${inventoryId}`]);
    }

    openInventory(inventoryId: string) {

        window.open(`inventories/${inventoryId}`);
    }

    openCategory(categoryId: string) {

        window.open(`categories/${categoryId}`);
    }

    edit(inventoryAttribute: InventoryAttribute) {
        this.store.dispatch(InventoryAttributesListTempleteActions.edit({
            inventoryAttribute
        }));
        this.appService.presentation$.next({});
    }

    filterInventoryAttributes(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getInventoryAttributes(): Promise<InventoryAttribute[]> {
        if (this.inventoryAttributesSubscription) this.inventoryAttributesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.inventoryAttributesSubscription = this.store.pipe(
                select(inventoryReducers.inventoryAttributesListTemplete_inventoryAttributes(), {
                    pageIndex: this.pageIndex,
                    descending: this.descending
                }), filter(x => x.loaded)).subscribe(result => {
                    this.resultCount = result.count;
                    this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                    resolve(result.inventoryAttributes);
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
        this.inventoryAttributes = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreInventoryAttributes = await this.getInventoryAttributes();

        if (moreInventoryAttributes.length > 0) {
            moreInventoryAttributes.forEach((inventoryAttribute: InventoryAttribute) => {
                this.inventoryAttributes.push(inventoryAttribute);
            });
            for (let i = 0; i < this.inventoryAttributes.length; i++) {
                let appendedInventoryAttribute = await this.append({ ...this.inventoryAttributes[i] });
                for (let i = 0; i < this.inventoryAttributes.length; i++) {
                    if (this.inventoryAttributes[i].id === appendedInventoryAttribute.id) {
                        this.inventoryAttributes[i] = appendedInventoryAttribute;
                    }
                }
            }
            window.scrollBy(0, -60 * moreInventoryAttributes.length);
            setTimeout(() => {
                this.loading = false;
            }, debounceTime);
        } else setTimeout(() => {
            this.loading = false;
        }, debounceTime);
    }
}