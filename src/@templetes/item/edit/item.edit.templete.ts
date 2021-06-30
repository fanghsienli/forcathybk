import { Component, OnInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import { Item } from "@entities/item";
import { Store } from "@ngrx/store";
import * as itemReducers from "@reducers/item";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { ItemEditTempleteActions } from "@actions/item";
import { ItemsService } from "@services/items.service";
import { SearchService } from "@services/search.service";
import { PresentationActions } from "@actions";
import { FileSave } from "@models/entity";
import { FilesService } from "@services/files.service";
import { InventoriesService } from "@services/inventories.service";
import { Inventory, Exchange } from "@entities/inventory";
import { ExchangesService } from "@services/exchanges.service";
import * as reducers from "@reducers";
@Component({
    selector: "itemEditTemplete",
    templateUrl: "item.edit.templete.html",
    styleUrls: ["item.edit.templete.css"],
    host: { "class": "piCib" }
})
export class ItemEditTemplete implements OnInit {
    @ViewChild("createFileInput", { static: true }) createFileInput: ElementRef;
    ngOnInitSubscription: Subscription;
    anyLike1$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    anyLike2$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    item: Item;
    itemValue: string = "";
    targetValue: string;
    error1: string = "";
    error2: string = "";
    isNew: boolean = true;
    locked: boolean = true;
    uploading: boolean = false;
    disable: boolean = false;
    mode: string = "";
    optionsSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    options: any[];
    loading: boolean;
    constructor(
        public itemsService: ItemsService,
        public filesService: FilesService,
        public store: Store<itemReducers.State>,
        public appService: AppService,
        public store$: Store<reducers.State>,
        public searchService: SearchService,
        public inventoriesService: InventoriesService,
        public exchangesService: ExchangesService
    ) { }
    /*
    @HostListener("click", ["$event"])
    public onClick(event: any): void {
        event.stopPropagation();
    }*/

    ngOnInit() {
        this.ngOnInitSubscription = this.store.select(itemReducers.itemEditTemplete_item).subscribe((item: Item) => {
            if (!item) {
                this.item = new Item();
                this.isNew = true;
            } else {
                this.item = { ...item };
                this.isNew = false;
                this.itemValue = this.item.value;
            }
            if (this.item.statusId === "4c593dd2-24a3-45a2-916c-0f77f0920e28") this.disable = true;
            else this.disable = false;
            this.anyLike1$.next((this.item.value || ""));
            this.anyLike2$.next((this.item.code || ""));
        });

        this.ngOnInitSubscription.add(this.anyLike1$.pipe(
            tap(anyLike => {
                if (anyLike.length === 0) {
                    this.error1 = "*名稱不得空白";
                }
                else {
                    this.error1 = "";
                }
            }),
            filter(valueLike => valueLike.length > 0),
            debounceTime(300),
            tap(() => { this.locked = true; }),
            switchMap(anyLike => this.itemsService.isDuplicate({
                excludeId: this.item.id,
                value: encodeURIComponent(anyLike)
            }))
        ).subscribe((isDuplicate: boolean) => {
            if (isDuplicate) {
                this.error1 = "*名稱重複";
            }
            else {
                if (this.item.value === "") {
                    this.error1 = "*代碼不得空白";
                }
                else {
                    this.error1 = "";
                }
            }
            this.locked = false;
        }));

        this.ngOnInitSubscription.add(this.anyLike2$.pipe(
            tap(anyLike => {
                if (anyLike.length === 0) {
                    this.error2 = "*代碼不得空白";
                }
                else {
                    this.error2 = "";
                }
            }),
            filter(valueLike => valueLike.length > 0),
            debounceTime(300),
            tap(() => { this.locked = true; }),
            switchMap(anyLike => this.itemsService.isDuplicate({
                excludeId: this.item.id,
                value: encodeURIComponent(anyLike)
            }))
        ).subscribe((isDuplicate: boolean) => {
            if (isDuplicate) {
                this.error2 = "*代碼重複";
            }
            else {
                if (this.item.code === "") {
                    this.error2 = "*代碼不得空白";
                }
                else {
                    this.error2 = "";
                }
            }
            this.locked = false;
        }));
    }
    ngOnDestroy() {
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
    }

    selectUnitGroup() {
        this.mode = "單位類型";
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        this.optionsSubscription = this.anyLike$.pipe(
            debounceTime(300),
            tap(() => {
                this.options = [];
                this.loading = true;
            }),
            switchMap(anyLike => this.inventoriesService.select({
                anyLike: encodeURIComponent(anyLike),
                itemId: "aa917cae-5aaf-4173-bd1e-ab3ab1e3393e",
                take: 5
            }))
        ).subscribe((options: Inventory[]) => {
            this.options = options;
            this.loading = false;
        });
    }
    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }
    selectOption(option: any) {
        switch (this.mode) {
            case "單位類型":
                this.anyLike = "";
                this.options = [];
                this.selectUnitTypeOk(option);
                break;
            default:
                this.item.unit = option;
                this.item.unitId = option.id;
                this.mode = "";
                this.options = [];
                break;
        }
      
    }

    selectUnitTypeOk(unitType) {
        this.mode = unitType.no;
        this.item.unitTypeId = unitType.id;
        if (this.optionsSubscription)this.optionsSubscription.unsubscribe();
        this.optionsSubscription = this.anyLike$.pipe(
            debounceTime(300),
            tap(() => {
                this.options = [];
                this.loading = true;
            }),
            switchMap(anyLike => this.exchangesService.select({
                anyLike: encodeURIComponent(anyLike),
                ownerId: unitType.id,
                take: 5
            }))
        ).subscribe((options: Exchange[]) => {
            this.options = options;
            this.loading = false;
        }, () => {
                this.loading = false;
        });
    }


    changePhoto() {
        // if (this.appService.profile.photo) this.appService.presentation$.next("變更大頭貼照"); else 
        this.createFileInput.nativeElement.click();
    }

    uploadPhoto(event) {
        this.locked = true;
        this.uploading = true;
        if (event.target.files) {
            this.filesService.create(<Array<File>>event.target.files, `items/${this.item.id}`).toPromise().then((fileSave: FileSave) => {
                this.item.photo = "converting";
                this.item.photoId = fileSave.photos[0].id;


                setTimeout(() => {
                    this.item.photo = fileSave.photos[0].target.path;
                    this.locked = false;
                    this.uploading = false;
                }, 1);


            }, () => {
                alert("圖片上傳失敗!");
                this.locked = false;
                this.uploading = false;
            });
        }
    }

    clickDisable() {
        this.disable = this.disable ? false : true;
        this.changeDisable();
    }

    changeDisable() {
        if (this.disable) this.item.statusId = "4c593dd2-24a3-45a2-916c-0f77f0920e28";
        else this.item.statusId = "005617b3-d283-461c-abef-5c0c16c780d0";
    }

    previousMode() {
        switch (this.mode) {
            case "單位類型":
                this.mode = "";
                break;
            default:
                this.mode = "單位類型";
                break;
        }
    }


    cancel() {
        this.store.dispatch(PresentationActions.close({ message: "" }));
    }

    create() {

        this.store.dispatch(ItemEditTempleteActions.create({ item: { ...this.item } }));
    }

    update() {
        this.store.dispatch(ItemEditTempleteActions.update({ item: { ...this.item } }));
    }

    keyup1(anyLike: string) {
        this.anyLike1$.next(anyLike.trim());
    }

    keyup2(anyLike: string) {
        this.anyLike2$.next(anyLike.trim());
    }
}