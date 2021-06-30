import { Component, OnInit, Input, EventEmitter, HostBinding, Output } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { InventoriesService } from "@services/inventories.service";
import { debounceTime, filter, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { Inventory } from "@entities/inventory";
import { AppService } from "@services/app.service";
import { InventorySelect } from "@models/inventory";
@Component({
    selector: "inventoryNo",
    templateUrl: "component.html",
    styleUrls: ["component.css"]
})
export class InventoryNoComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() inventory$: BehaviorSubject<Inventory>;
    @Input() errors$: BehaviorSubject<string[]>;
    inventory: Inventory;
    hoverId: string;
    inventoryNo$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    titleFocused: boolean;
    inventoryNoCount$: Observable<number>;
    errorText: string;
    inventorySelects: InventorySelect[];
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    @HostBinding("class._error") isDuplicated: boolean = false;
    app: any;
    subscription: Subscription;
    focused: boolean;
    inventoryNo: string;
    open: boolean;
    inventoryCountSubscription: Subscription;
    loading: boolean;
    hoverClear: boolean;
    entered: boolean;
    constructor(
        public appService: AppService,
        public inventoriesService: InventoriesService
    ) {
        this.loading = false;
        this.focused = false;
        this.entered = false;
        this.hoverClear = false;
        this.isEmpty = true;
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

    checkInventoryNo(inventoryNo: string) {
        this.inventoryNo$.next(inventoryNo);
    }

    focus() {
        if (!this.focused) this.focused = true;
    }

    blur2() {
        if (!this.autocomplete) this.blur();
    }

    blur() {
        this.focused = false;
        if (this.hoverId && this.inventorySelects.length > 0) this.inventoryNo = this.inventorySelects.find(x => x.id === this.hoverId).no;
        if (this.hoverClear === true || this.inventoryNo === "") {
            this.hoverClear = true;
            this.inventoryNo = "";
        }
        this.inventoryNo$.next(this.inventoryNo);
        let inventory = this.inventory$.getValue();
        inventory.no = this.inventoryNo;
        this.inventory$.next(inventory);
    }

    keydown(event) {
        if (event.code === "NumpadEnter") {
            this.entered = true;
            this.inventoryNo$.next(this.inventoryNo);
        }
    }

    click(inventorySelect: InventorySelect) {
        this.inventoryNo = inventorySelect.no;
        this.blur();
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
    resetInventory() {
        let inventory = this.inventory$.getValue();
        inventory.no = this.inventoryNo;
        this.inventory$.next(inventory);
    }
    ngOnInit() {
        this.subscription = this.inventory$.subscribe(inventory => {
            this.inventory = inventory;
            this.inventoryNo = this.inventory.no || "";
            if (this.inventoryNo$.getValue() !== this.inventoryNo) this.inventoryNo$.next(this.inventoryNo);
            if (!this.autocomplete) {
                if (this.inventoryCountSubscription) this.inventoryCountSubscription.unsubscribe();
                this.inventoryCountSubscription = this.inventoriesService.count({ no: this.inventoryNo, excludeId: this.inventory$.getValue().id }, false).subscribe(count => {
                    if (count > 0) this.isDuplicated = true;
                    else this.isDuplicated = false;
                });
            }
        });

        if (this.autocomplete) {
            this.subscription.add(
                this.inventoryNo$.pipe(
                    tap(noLike => { if (noLike.length === 0) this.inventorySelects = []; }),
                    filter(noLike => noLike.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    tap(() => { if (this.focused === true) this.loading = true; }),
                    switchMap(noLike => this.inventoriesService.getSelect({ noLike: encodeURIComponent(noLike) }, false))
                ).subscribe((inventorySelects: InventorySelect[]) => {
                    if (this.focused === true) this.inventorySelects = inventorySelects;
                    this.loading = false;
                })
            );

            this.subscription.add(
                this.inventoryNo$.pipe(
                    tap(no => {
                        if (no.length === 0 && this.hoverClear) {
                            let inventory = this.inventory$.getValue();
                            let newInventory = new Inventory();
                            newInventory.value = inventory.value;
                            this.hoverClear = false;
                            this.inventory$.next(newInventory);
                        }
                    }),
                    filter(no => no.length > 0 && this.focused === false),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(no => this.inventoriesService.getBy({ no: no }, false))
                ).subscribe((existedInventory: Inventory) => {
                    if (existedInventory) this.inventory$.next(existedInventory);
                    else {
                        let inventory = this.inventory$.getValue();
                        let newInventory = new Inventory();
                        newInventory.no = this.inventoryNo;
                        newInventory.value = inventory.value;
                        this.inventory$.next(newInventory);
                    }
                    this.inventorySelects = [];
                })
            );
        } else {
            this.subscription.add(
                this.inventoryNo$.pipe(
                    tap(no => {
                        this.inventoryNo = no;
                        let errors = this.appService.errors$.getValue();
                        if (no.length === 0) {
                            this.hoverClear = false;
                            this.resetInventory();
                            errors = errors.filter(x => x !== "存量編號重複");
                            this.isDuplicated = false;
                            errors.push("存量編號空白");
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                            errors = errors.filter(x => x !== "存量編號空白");
                        }
                        this.appService.errors$.next(errors);
                    }),
                    filter(no => no.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(no => this.inventoriesService.count({ no: no, excludeId: this.inventory$.getValue().id }, false))
                ).subscribe(count => {
                    let errors = this.appService.errors$.getValue();
                    if (count > 0) {
                        if (!errors.find(x => x === "存量編號重複")) errors.push("存量編號重複");
                        this.isDuplicated = true;
                    }
                    else {
                        errors = errors.filter(x => x !== "存量編號重複");
                        this.isDuplicated = false;
                    }
                    this.appService.errors$.next(errors);
                    this.resetInventory();
                })
            );
        }
    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }
}
