import { Component, OnInit, Input } from "@angular/core";
import { AppService } from "@services/app.service";
import { Inventory } from "@entities/inventory";
import { Grid } from "@models/app.model";

@Component({
    selector: "inventoryConfirm",
    templateUrl: "component.html",
    styleUrls: ["component.css"],
    host: { "class": "piCib", "style": "display:flex;flex-direction:row;border-bottom:1px solid #efefef" }
})
export class InventoryConfirmComponent implements OnInit {
    @Input() inventoryGrid: Grid;
    constructor(
        public appService: AppService
    ) { }

    ngOnInit() { }

    validateNum(event: KeyboardEvent): void {
        const pattern = /^[0-9]*$/g;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    keyup(inventoryGrid: Grid, p: string) {
        if (p !== "") {            
            if (parseInt(p) > 0) inventoryGrid._value = parseInt(p) < inventoryGrid.value ? parseInt(p) : inventoryGrid.value;
            else inventoryGrid._value = 1;
        } else inventoryGrid._value = 1;
        this.update(inventoryGrid);
    }

    minus(inventoryGrid: Grid) {
        let p: string = inventoryGrid._value === "" ? "0" : inventoryGrid._value;
        inventoryGrid._value = parseInt(p) > 1 ? (parseInt(p) - 1) : 1;
        this.update(inventoryGrid);
    }

    plus(inventoryGrid: Grid) {
        let p: string = inventoryGrid._value === "" ? "0" : inventoryGrid._value;
        inventoryGrid._value = parseInt(p) < inventoryGrid.value ? (parseInt(p) + 1) : parseInt(p);
        this.update(inventoryGrid);
    }

    remove(inventoryGrid: Grid)  {
        let inventories = this.appService.inventories$.getValue();
        inventories = inventories.filter(x => x.id !== inventoryGrid.id);
        this.appService.inventories$.next(inventories);
    }

    update(inventoryGrid: Grid)  {
        let inventories = this.appService.inventories$.getValue();
        let existedInventory = inventories.find(x => x.id === inventoryGrid.id);
        if (!existedInventory) {
            if (inventoryGrid._value > 0) inventories.push(inventoryGrid);
        }
        else existedInventory = inventoryGrid;
        this.appService.inventories$.next(inventories);
    }
}