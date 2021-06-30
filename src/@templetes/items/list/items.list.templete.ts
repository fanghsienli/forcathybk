import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ItemsService } from "@services/items.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import { DialogService } from "@services/dialog.service";
import { Grid } from "@models/app.model";
import { OptionsService } from "@services/options.service";
import * as XLSX from "xlsx";
import { Item } from "@entities/item";
import { Store, select } from "@ngrx/store";
import * as itemReducers from "@reducers/item";
import { ItemsListTempleteActions } from "@actions/item";
import { filter, map, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PresentationActions } from '../../../@actions';

@Component({
    selector: "itemsListTemplete",
    templateUrl: "items.list.templete.html",
    styleUrls: ["items.list.templete.css"]
})
export class ItemsListTemplete implements OnInit {

    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    action: string;
    actionSubscription: Subscription;
    itemsSubscription: Subscription;
    itemSubscription: Subscription;
    params: any;
    id: string;
    @ViewChild("exportTable") exportTable: ElementRef;
    loading: boolean;
    activatedRouteSubscription: Subscription;
    @Input() attributeEditTempletes$: BehaviorSubject<string[]>;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    categoryId$: Observable<string>;
    items$: Observable<Item[]>;
    total$: Observable<number>;
    loading$: Observable<boolean>;
    error$: Observable<string>;
    maxPage: number = 0;
    orderBy: any;
    descending: boolean;
    pageIndex: number = 0;
    pageSize: number = 15;
    items: Item[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    firstLoad: boolean = true;
    hoverId: string;
    selectedItem: Item;
  
    defaultSearchText: string;
    constructor(
        private router: Router,
        private itemsService: ItemsService,
        public dialogService: DialogService,
        public activatedRoute: ActivatedRoute,
        public optionsService: OptionsService,
        public appService: AppService,
        private itemStore$: Store<itemReducers.State>) {
        this.items = new Array<Item>();

        this.itemStore$.dispatch(ItemsListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.itemStore$.select(itemReducers.itemsListTemplete_total);
    }
    more(item: Item) {
        this.selectedItem = { ...item };
        this.hoverId = this.selectedItem.id;
        let presentation = {
            title: "more",
            buttons: [
                {
                    color: "blue",
                    title: "編輯",
                    action: "editItem",
                    params: {
                        item: { ...this.selectedItem }
                    }
                }
            ]
        };

        if (item.deletable) {
            let button = {
                color: "red",
                title: "刪除",
                action: "remove",
                params: {
                    item: { ...this.selectedItem }
                }
            };

            presentation.buttons.push(button);

        }

        presentation.buttons = presentation.buttons.map(button => {
            button.action = ItemsListTempleteActions[button.action];
            return button;
        });
        let buttons = presentation.buttons;
        this.itemStore$.dispatch(ItemsListTempleteActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }
    async sort(orderBy: string) {
        if (this.orderBy === orderBy) this.descending = this.descending ? false : true;
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.itemStore$.dispatch(ItemsListTempleteActions.setSort({
            orderBy: this.orderBy,
            descending: this.descending
        }));
        this.reLoad(1);
    }

    delete(item: Item) {
        this.itemStore$.dispatch(ItemsListTempleteActions.remove({ item }));
    }

    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.itemSubscription) this.itemSubscription.unsubscribe();
        if (this.itemsSubscription) this.itemsSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        this.appService.defaultSearchText$.next(this.defaultSearchText);
    }

    setPageSize() {
        this.itemStore$.dispatch(ItemsListTempleteActions.setPageSize({
            pageSize: this.pageSize
        }));
    }

    ngOnInit() {
        this.defaultSearchText = this.appService.defaultSearchText$.getValue();
        this.anyLike$.next(this.defaultSearchText);
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.anyLike = anyLike;
            this.itemStore$.dispatch(ItemsListTempleteActions.setFilter({ anyLike: anyLike }));
            this.reLoad(1);
        });
        this.ngOnInitSubscription.add(
            this.itemStore$.pipe(select(itemReducers.itemsListTemplete_upsertId)).subscribe((upsertId: string) => {
                if (this.itemSubscription) this.itemSubscription.unsubscribe();
                this.itemSubscription = this.itemStore$.pipe(
                    select(itemReducers.itemEntities_item(), {
                        id: upsertId
                    })
                ).subscribe(async (item: Item) => {
                    if (item) {
                        for (let i = 0; i < this.items.length; i++) {
                            if (this.items[i].id === item.id) {
                                this.items[i] = { ...item };
                            }
                        }
                        if (!this.items.find(x => x.id === item.id)) this.items.push({ ...item });
                    }
                });
            })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.itemStore$.pipe(select(itemReducers.itemsListTemplete_removeId)).subscribe((removedId: string) => {

                if (this.items.find(x => x.id === removedId)) this.resultCount--;
                this.items = this.items.filter(x => x.id !== removedId);
            })
        );

        this.ngOnInitSubscription.add(
            this.itemStore$.pipe(select(itemReducers.itemsListTemplete_uploadIds)).subscribe((uploadIds: string[]) => {

                console.log(uploadIds);
            })
        );

        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            this.params = { statusId: "005617b3-d283-461c-abef-5c0c16c780d0" };
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

    uploadExcel(uploadEvent: Event) {     
        this.itemStore$.dispatch(PresentationActions.message({ message: { h3: "上傳中", div: "品項上傳中, 請稍後..." } }));
        const target: DataTransfer = <DataTransfer><unknown>(uploadEvent.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
            const bstr: string = e.target["result"];
            this.itemStore$.dispatch(ItemsListTempleteActions.upload({ bstr }));
        };
        reader.readAsBinaryString(target.files[0]);
    }
    upload() {
        this.hiddenUpload.nativeElement.click();
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    editItem(item: Item) {
        this.itemStore$.dispatch(ItemsListTempleteActions.editItem({ item }));
        //  this.router.navigate([`items/${item.id}/edit`]);
    }

    newItem() {
         this.itemStore$.dispatch(ItemsListTempleteActions.newItem());
    }

    filterItems(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getItems(): Promise<Item[]> {
        if (this.itemsSubscription) this.itemsSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.itemsSubscription = this.itemStore$.pipe(
                select(itemReducers.getItems(), {
                    pageIndex: this.pageIndex,
                    descending: this.descending
                }), filter(x => x.loaded)).subscribe(result => {
                    this.resultCount = result.count;
                    this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                    resolve(result.items);
                });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.itemStore$.dispatch(ItemsListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.items = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreItems = await this.getItems();
        if (moreItems.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreItems.forEach(item => {
                if (!this.items.find(x => x.id === item.id)) this.items.push({ ...item });
            });
            window.scrollTo({ top: pageYOffset });
            setTimeout(() => this.loading = false, debounceTime);
        } else {
            setTimeout(() => this.loading = false, debounceTime);
        }
    }
}