import { Component, OnInit, Input, HostBinding, ElementRef, ViewChild } from "@angular/core";
import { BehaviorSubject, Subscription, Observable, of } from "rxjs";
import { InventoriesService } from "@services/inventories.service";
import { Inventory } from "@entities/inventory";
import { AppService } from "@services/app.service";
import { tap, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: "inventoryValue",
    templateUrl: "component.html",
    styleUrls: ["component.css"]
})
export class InventoryValueComponent implements OnInit {
    @Input() inventory$: BehaviorSubject<Inventory>;
    @Input() errors$: BehaviorSubject<string[]>;
    @Input() autocomplete: boolean;
    inventory: Inventory;
    hoverId: string;
    inventoryValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    titleFocused: boolean;
    errorText: string;
    inventoryValue: string;
    @ViewChild("inventoryValueInput") inventoryValueInput: ElementRef;
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    focused: boolean;
    subscription: Subscription;
    inventoryValueSubscription: Subscription;
    hoverClear: boolean;
    constructor(
        public appService: AppService,
        public inventoriesService: InventoriesService
    ) {
        this.inventoryValue = "";
        this.focused = false;
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
    }

    beforeIsControl: boolean;
    paste(event): void {
        let clipboardData = event.clipboardData;
        let pastedText = clipboardData.getData('text');
        var regEx = /[^\d.\d]/g;
        pastedText = pastedText.replace(regEx, '');
        let pastedText1 = pastedText.split(".")[0] + ".";
        for (let i = 1; i < pastedText.split(".").length; i++) {
            pastedText1 = pastedText1 + pastedText.split(".")[i].replace(".", "");
        }
        if (pastedText1.length > 1) {
            let left0 = pastedText1.substr(0, 1);
            while (left0 === "0") {
                pastedText1 = pastedText1.substr(1);
                left0 = pastedText1.substr(0, 1);
            }
            if (left0 === ".") pastedText1 = "0"+pastedText1;
        }
        if (pastedText1.length > 1) {
            let right0 = pastedText1.substr(pastedText1.length - 1);
            while (right0 === ".") {
                pastedText1 = pastedText1.substr(0, pastedText1.length - 1);
                right0 = pastedText1.substr(pastedText1.length - 1);
            }
        }
        this.inventoryValueInput.nativeElement.value = pastedText1;
        event.preventDefault();
    }
    keydown(event): void {
        let pattern = "1234567890";
        let inputChar = event.key;
        if (event.target.selectionStart === 0 && event.target.selectionEnd === 0 &&
            (event.code === "Numpad0" || event.code === "Digit0") && this.inventoryValue.length > 0) { 
            event.preventDefault();
        }
        if (event.target.selectionStart === 1 && event.target.selectionEnd === 1 &&
            (event.code === "Numpad0" || event.code === "Digit0") && this.inventoryValue.length > 0 && this.inventoryValue.substr(0, 1) === "0") {
            event.preventDefault();
        }        
        if (event.key === "." && this.inventoryValue.indexOf(".") !== -1) {
            event.preventDefault(); 
            event.stopPropagation();
        }

        if (!this.beforeIsControl) {
            if (event.key !== "Backspace" &&
                event.key !== "Shift" &&
                event.key !== "." &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Delete" &&
                event.key !== "Control") {
                if (pattern.indexOf(inputChar) === -1) {
                    event.preventDefault();
                }
            }
        }
        if (event.key === "Control") this.beforeIsControl = true;
        else this.beforeIsControl = false;
    }

    keyup(inventoryValue: string) {
        var regEx = /[^\d.\d]/g;
        inventoryValue = inventoryValue.replace(regEx, '');
        if (inventoryValue.length > 1) {
            let left0 = inventoryValue.substr(0, 1);
            while (left0 === "0") {
                if (inventoryValue.substr(0, 2) === "0.") break;
                else inventoryValue = inventoryValue.substr(1);
                left0 = inventoryValue.substr(0, 1);
            }
            if (inventoryValue.substr(0, 1) === ".") inventoryValue = "0" + inventoryValue;
        }
        this.inventoryValueInput.nativeElement.value = inventoryValue;
        let errors = this.appService.errors$.getValue();
        if (inventoryValue.length === 0) {
            if (this.hoverClear) this.hoverClear = false;
            this.isEmpty = true;
            if (!errors.find(x => x === "存量數量空白")) errors.push("存量數量空白");
        } else {
            this.isEmpty = false;
            errors = errors.filter(x => x !== "存量數量空白");
        }
        this.appService.errors$.next(errors);
        let inventory: Inventory = this.inventory$.getValue();
        if (inventoryValue.length > 0) {
            inventory.value = parseFloat(inventoryValue);
            this.inventory$.next(inventory);
        }
        
    }

    blur() {        
        this.focused = false;
        let inventoryValue = this.inventoryValueInput.nativeElement.value;
        
        let inventoryValue1 = inventoryValue.split(".")[0] + ".";
        for (let i = 1; i < inventoryValue.split(".").length; i++) {
            inventoryValue1 = inventoryValue1 + inventoryValue.split(".")[i].replace(".", "");
        }
        inventoryValue = inventoryValue1;
        let right0 = inventoryValue.substr(inventoryValue.length - 1);
        while (right0 === ".") {
            inventoryValue = inventoryValue.substr(0, inventoryValue.length - 1);
            right0 = inventoryValue.substr(inventoryValue.length - 1);
        } 
        this.keyup(inventoryValue);
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.subscription = this.inventory$.subscribe(inventory => {
            this.inventory = inventory;
            if (inventory.value.toString() === "" || (this.inventoryValue === "" && inventory.value.toString()!=="")) this.inventoryValue = inventory.value.toString();
        });
    }

    focus() {
        if (!this.focused) this.focused = true;
    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }
}
