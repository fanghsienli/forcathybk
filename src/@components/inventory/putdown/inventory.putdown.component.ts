import { Component, OnInit, Input } from "@angular/core";
import { AppService } from "@services/app.service";
import { Inventory } from "@entities/inventory"; 
import { Router } from '@angular/router';
@Component({
    selector: "inventoryPutdown",
    templateUrl: "inventory.putdown.component.html",
    styleUrls: ["inventory.putdown.component.css"],
    host: { "class": "piCib"}
})
export class InventoryPutdownComponent implements OnInit {
    @Input() inventory: Inventory;
    constructor(

        public router: Router,
        public appService: AppService) {
    }
    ngOnInit() {}

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    goToRecipe(recipeId: string) {
        this.router.navigate([`recipes/${recipeId}`]);
    }

    goToInventory(inventoryId: string) {
        this.router.navigate([`inventories/${inventoryId}`]);
    } 

    select(inventory: Inventory) {
        inventory._select = true;
        let inventories = this.appService.inventories$.getValue();
        inventories.push(inventory);
        this.appService.inventories$.next(inventories);
    }

    remove(inventory: Inventory) {
        inventory._select = false;
        let inventories = this.appService.inventories$.getValue();
        inventories = inventories.filter(x => x.id !== inventory.id);
        this.appService.inventories$.next(inventories);
    }

    update(inventory: Inventory) {
        let inventories = this.appService.inventories$.getValue();
        let existedInventory = inventories.find(x => x.id === inventory.id);
        if (!existedInventory) {
            if (inventory._take > 0) inventories.push(inventory);
        }
        else {
            existedInventory = inventory;
        }
        this.appService.inventories$.next(inventories);
    }

    putDownAll(inventory: Inventory) {        
        let inventories = [];
        inventory.value = inventory._take;
        inventories.push(inventory);
        this.appService.inventories$.next(inventories);
        this.appService.action$.next("放置");
    }

    putDown(inventory: Inventory) {
        let inventories = [];
        inventories.push(inventory);
        this.appService.inventories$.next(inventories);
        this.appService.action$.next("部分放置");
    }
}