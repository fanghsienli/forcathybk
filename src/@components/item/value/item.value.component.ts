import { Component, OnInit, Input, EventEmitter, HostBinding, Output } from "@angular/core";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ItemsService } from "@services/items.service";
import { debounceTime, filter, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { Item } from "@entities/item";
import { AppService } from "@services/app.service";
import { ItemSelect } from "@models/item";

@Component({
    selector: "itemValue",
    templateUrl: "item.value.component.html",
    styleUrls: ["item.value.component.css"]
})
export class ItemValueComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() item$: BehaviorSubject<Item>;
    item: Item;
    hoverId: string;
    itemValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    titleFocused: boolean;
    itemValueCount$: Observable<number>;
    errorText: string;
    itemSelects: ItemSelect[];
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class._info") isNewItem: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    @HostBinding("class._error") isDuplicated: boolean = false;
    @HostBinding("class._disabled") isDisabled: boolean = false;
    app: any;
    itemSubscription: Subscription;
    subscription: Subscription;
    focused: boolean;
    itemValue: string;
    open: boolean;
    itemCountSubscription: Subscription;
    loading: boolean;
    hoverClear: boolean;
    entered: boolean;
    constructor(
        public appService: AppService,
        public itemsService: ItemsService
    ) {
        this.itemSelects = new Array<ItemSelect>();
        this.loading = false;
        this.focused = false;
        this.hoverClear = false;
        this.isNewItem = false;
        this.isEmpty = false;
        this.isDuplicated = false;
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
        this.itemSelects = new Array<ItemSelect>();
    }

    createFile(event) {
        this.change.emit(event);
    }

    checkItemValue(itemValue: string) {
        this.itemValue$.next(itemValue.trim());
    }

    focus() {
        if (!this.focused) this.focused = true;
        this.itemValue$.next(this.itemValue);
    }
    blur2() {
        if (!this.autocomplete) this.blur();
    }
    blur() {
        this.focused = false;
        if (this.hoverId && this.itemSelects.length > 0) this.itemValue = this.itemSelects.find(x => x.id === this.hoverId).value;
        if (this.hoverClear === true || this.itemValue === "") {
            this.hoverClear = true;
            this.itemValue = "";
        }
        if (!this.isEmpty) {
            this.itemValue$.next(this.itemValue.trim());
        } else {
            this.itemValue$.next("");
        }

    }

    keydown(event) {
        if (event.code === "NumpadEnter") {
            this.entered = true;
            this.itemValue$.next(this.itemValue.trim());
        }
    }

    click(itemSelect: ItemSelect) {
        console.log(itemSelect);
        this.itemValue = itemSelect.value;
        this.blur();
    }

    ngOnDestroy() {
        if (this.itemSubscription) this.itemSubscription.unsubscribe();
        if (this.subscription) this.subscription.unsubscribe();
        if (this.itemCountSubscription) this.itemCountSubscription.unsubscribe();
    }

    resetItem() { 
    }

    ngOnInit() {
        let item = this.item$.getValue();        
        if (item) {
            this.itemValue = item.value || "";
            if (this.itemValue !== "" && item.statusId === "005617b3-d283-461c-abef-5c0c16c780d0" && this.appService.module==="inventories") {
                this.isDisabled = true;
            }
            this.itemValue$.next(this.itemValue);
        } else {
            this.subscription = this.item$.subscribe(item => {
                if (this.item) {
                    this.item = item;
                    this.itemValue = this.item.value || "";
                    this.isNewItem = Boolean(!item.createdById && item.value);
                    if (this.itemValue$.getValue() !== this.itemValue) this.itemValue$.next(this.itemValue);
                    if (this.itemValue$.getValue() === "") {
                        let errors = this.appService.errors$.getValue();
                        if (!errors.find(x => x === "品項空白")) errors.push("品項空白");
                        this.appService.errors$.next(errors);
                    }
                    if (!this.autocomplete && this.itemValue.length > 0) {
                        if (this.itemCountSubscription) this.itemCountSubscription.unsubscribe();
                        this.itemCountSubscription = this.itemsService.count({ value: this.itemValue, excludeId: this.item$.getValue().id }).subscribe(count => {
                            if (count > 0) this.isDuplicated = true;
                            else this.isDuplicated = false;
                        });
                    }
                }
            });
        }
        if (this.autocomplete) {
            this.itemSubscription = this.itemValue$.pipe(
                tap(valueLike => {
                    if (valueLike.length === 0) this.itemSelects = [];
                }),
                filter(valueLike => valueLike.length > 0),
                debounceTime(200), 
                tap(() => { if (this.focused === true) this.loading = true; }),
                switchMap(valueLike => this.itemsService.getSelect({ anyLike: encodeURIComponent(valueLike) }))
            ).subscribe((itemSelects: ItemSelect[]) => {
                if (this.focused === true) this.itemSelects = itemSelects;
                this.loading = false;
            });

            this.itemSubscription.add(
                this.itemValue$.pipe(

                    tap(value => {
                        
                        this.itemValue = value;
                        let errors = this.appService.errors$.getValue();
                        if (value === "") {
                            this.hoverClear = false;
                            errors = errors.filter(x => x !== "品項編碼空白" && x !== "品項編碼重複");
                            this.isNewItem = false;
                            if (!errors.find(x => x === "品項空白")) errors.push("品項空白");
                            this.isEmpty = true;
                        } else {
                            errors = errors.filter(x => x !== "品項空白");
                            this.isEmpty = false;
                        }
                        this.appService.errors$.next(errors);
                    }),
                    debounceTime(200),
                  //  distinctUntilChanged(),
                    switchMap(value => {
                        if (value.length === 0) {
                            return of(null);
                        } else {
                            return this.itemsService.getBy({ value: encodeURIComponent(value) }, false);
                        }
                    })
                ).subscribe((existedItem: Item) => { 
                    if (existedItem) {
                        this.isNewItem = false;
                        this.item$.next(existedItem);
                        let errors = this.appService.errors$.getValue();
                        errors = errors.filter(x => x !== "品項編碼空白" && x !== "品項編碼重複" && x !== "單位空白" && x !== "單位重複" && x !== "單位編碼空白" && x !== "單位編碼重複");
                        this.appService.errors$.next(errors);
                    }
                    else {
                        this.isNewItem = true;
                        this.resetItem();
                    }
                    //this.itemSelects = [];
                })
            );
        } else {//
            this.itemSubscription = 
                this.itemValue$.pipe(
                    tap(value => {
                        let errors = this.appService.errors$.getValue();
                        let item = this.item$.getValue();
                        item.value = value;
                        if (value.length === 0) {
                            this.hoverClear = false;
                            errors = errors.filter(x => x !== "品項重複");
                            this.isDuplicated = false;
                            if (!errors.find(x => x === "品項空白")) errors.push("品項空白");
                            this.isEmpty = true;
                        } else {
                            errors = errors.filter(x => x !== "品項空白");
                            this.isEmpty = false;
                        }
                        this.appService.errors$.next(errors);
                        this.item$.next(item);
                    }),
                    filter(code => code.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(value => this.itemsService.count({ value: value, excludeId: this.item$.getValue().id }))
            ).subscribe(count => {
                console.log(count);
                    let errors = this.appService.errors$.getValue();
                    if (count > 0) {
                        this.isDuplicated = true;
                        if (!errors.find(x => x === "品項重複")) errors.push("品項重複");
                    }
                    else {
                        errors = errors.filter(x => x !== "品項重複");
                        this.isDuplicated = false;
                    }
                    this.appService.errors$.next(errors);
                });
        }
    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }
}
