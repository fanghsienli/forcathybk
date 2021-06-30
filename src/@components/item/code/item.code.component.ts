import { Component, OnInit, Input, EventEmitter, HostBinding, Output } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { ItemsService } from "@services/items.service";
import { debounceTime, filter, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { Item } from "@entities/item";
import { AppService } from "@services/app.service";
import { ItemSelect } from "@models/item";

@Component({
    selector: "itemCode",
    templateUrl: "item.code.component.html",
    styleUrls: ["item.code.component.css"]
})
export class ItemCodeComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() item$: BehaviorSubject<Item>;
    @Input() errors$: BehaviorSubject<string[]>;
    @Input() title: string;
    item: Item;
    hoverId: string;
    itemCode$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    titleFocused: boolean;
    itemCodeCount$: Observable<number>;
    errorText: string;
    itemSelects: ItemSelect[];
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;


    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class._info") isNewItem: boolean = false;
    @HostBinding("class._error") isDuplicated: boolean = false;
    app: any;
    subscription: Subscription;
    focused: boolean;
    itemCode: string;
    open: boolean;
    itemCountSubscription: Subscription;
    loading: boolean;
    hoverClear: boolean;
    constructor(
        public appService: AppService,
        public itemsService: ItemsService
    ) {
        this.loading = false;
        this.focused = false;
        this.isNewItem = false;
        this.isEmpty = false;
        this.isDuplicated = false;
        this.hoverClear = false;
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
    }

    createFile(event) {
        this.change.emit(event);
    }

    checkItemCode(itemCode: string) {
        this.itemCode$.next(itemCode.trim());
    }

    focus() {
        if (!this.focused) this.focused = true;
    }

    blur2() {
        if (!this.autocomplete) this.blur();
    }

    blur() {
        this.focused = false;
        if (this.hoverId && this.itemSelects.length > 0) this.itemCode = this.itemSelects.find(x => x.id === this.hoverId).code;
        if (this.hoverClear === true) this.itemCode = "";
        this.itemCode$.next(this.itemCode.trim());
    }

    click(itemSelect: ItemSelect) {
        this.itemCode = itemSelect.code;
        this.blur();
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
        if (this.itemCountSubscription) this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.subscription = this.item$.subscribe(item => {
            this.itemCode = item.code || "";
            if (this.itemCode$.getValue() !== this.itemCode) this.itemCode$.next(this.itemCode);
            this.isNewItem = Boolean(!item.createdById && item.value);
            if (this.itemCode$.getValue() === "") {
                let errors = this.appService.errors$.getValue();
                if (!errors.find(x => x === "品項編碼空白")) errors.push("品項編碼空白");
                this.appService.errors$.next(errors);
            }
           
        });

        if (this.autocomplete) {
        } else {
            this.subscription.add(
                this.itemCode$.pipe(                   
                    tap(code => { 
                        let errors = this.appService.errors$.getValue();
                        let item = this.item$.getValue();
                        item.code = code;   
                        if (code.length === 0) {
                            if (this.hoverClear) this.hoverClear = false;
                            errors = errors.filter(x => x !== "品項編碼重複");
                            this.isDuplicated = false;
                            if (!errors.find(x => x === "品項編碼空白")) errors.push("品項編碼空白");
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                            errors = errors.filter(x => x !== "品項編碼空白");
                        }
                        this.appService.errors$.next(errors);
                        this.item$.next(item);  
                    }),
                    filter(code => code.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(code => this.itemsService.count({ code: code, excludeId: this.item$.getValue().id }))
                ).subscribe(count => {
                    let errors = this.appService.errors$.getValue();
                    if (count > 0) {                       
                        if (!errors.find(x => x === "品項編碼重複")) errors.push("品項編碼重複");
                        this.isDuplicated = true;
                    }
                    else {
                        errors = errors.filter(x => x !== "品項編碼重複");
                        this.isDuplicated = false;
                    }
                    this.appService.errors$.next(errors);
                })
            );
        }
    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }
}
