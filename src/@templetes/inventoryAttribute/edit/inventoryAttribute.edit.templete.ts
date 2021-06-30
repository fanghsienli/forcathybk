import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as inventoryReducers from "@reducers/inventory";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { InventoryAttributeEditTempleteActions } from "@actions/inventory";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { SearchService } from "@services/search.service"; 

@Component({
    selector: "inventoryAttributeEditTemplete",
    templateUrl: "inventoryAttribute.edit.templete.html",
    styleUrls: ["inventoryAttribute.edit.templete.css"],
    host: { "class": "piCib" }
})
export class InventoryAttributeEditTemplete implements OnInit {
    anyLike: string;
    inventoryAttributeSubscription: Subscription;
    inventoriesSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    inventory: Inventory;
    inventories: Inventory[];
    mode: string;
    loading: boolean;
    id: string;
    ownerId: string;
    targetValue: string;
    valueType: string;
    valueNumber: number = 1;
    categoryIds: string = "";
    inventoryIds: string = "";
    inventoryId: string;
    categoryValues: string;
    must: boolean;
    show: boolean;
    conditions: any[];
    selectedConditions: any[];
    isNew: boolean = true;
    inventoryAttribute: InventoryAttribute;
    constructor(
        public categoriesService: CategoriesService,
        public inventoriesService: InventoriesService,
        public store: Store<inventoryReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {/*
        this.inventoryAttributeSubscription = this.store.select(inventoryReducers.inventoryAttributeEditTempleteState).subscribe((state) => {
            this.targetValue = state.targetValue;
            this.level = state.level;
            this.valueNumber = state.valueNumber;
            switch (this.level) {
                case 1:
                    this.must = false;
                    this.show = false;
                    break;
                case 2:
                    this.must = false;
                    this.show = true;
                    break;
                case 3:
                    this.must = true;
                    this.show = true;
                    break;
                default:
                    break;
            }

            this.valueType = state.valueType;
            this.ownerId = state.ownerId;
            this.id = state.id;
            if (state.targetValue !== "") this.isNew = false;
        });*/
        this.conditions = new Array<any>();
        this.selectedConditions = new Array<any>();
    }

    ngOnDestroy() {
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.inventoryAttributeSubscription) this.inventoryAttributeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.inventoriesSubscription = this.anyLike$.pipe(
            tap(anyLike => {
                if (anyLike.length === 0) this.inventories = [];
            }),
            filter(valueLike => valueLike.length > 0),
            debounceTime(200),
            tap(() => { this.loading = true; }),
            switchMap(anyLike => this.searchService.selectConditions({ anyLike: encodeURIComponent(anyLike), take: 5 }))
        ).subscribe((conditions: any[]) => {
            this.conditions = conditions;
            this.loading = false;
        });
    }

    remove(conditionId: string) {
        this.selectedConditions = this.selectedConditions.filter(x => x.id !== conditionId);
        console.log(this.selectedConditions);
    }


    hasError() {

        if (this.targetValue === "") return true;
        if (this.valueType === "number" || this.valueType === "inventory") {
            if (!this.inventory) return true;
            if (this.inventory.no === "") return true;
        }
        return false;
    }

    change(target) {
        if (target.checked) {
            this.valueType = target.value;
            if (target.value !== "number" && target.value !== "inventory") {
                this.inventory = null;
            }
        }
    }

    setMode(mode: string) {
        this.mode = mode;
        this.anyLike = "";
        this.anyLike$.next("");
    }

    cancel() {
        this.appService.presentation$.next(null);
    }

    create() {
        this.selectedConditions.forEach((condition) => {
            switch (condition.type) {
                case "inventories":
                    this.inventoryIds = this.inventoryIds + "," + condition.id;
                    break;
                case "inventories":
                    this.inventoryIds = this.inventoryIds + "," + condition.id;
                    break;
                case "categories":
                    this.categoryIds = this.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.inventoryIds.substr(0, 1) === ",") this.inventoryIds = this.inventoryIds.substr(1);
        if (this.inventoryIds.substr(0, 1) === ",") this.inventoryIds = this.inventoryIds.substr(1);
        if (this.categoryIds.substr(0, 1) === ",") this.categoryIds = this.categoryIds.substr(1);
        this.store.dispatch(InventoryAttributeEditTempleteActions.create({ inventoryAttribute: this.inventoryAttribute }));
    }



    level: number = 1;
    clickMust() {
        this.must = this.must ? false : true;
        this.changeMustShow();
    }
    clickShow() {
        this.show = this.show ? false : true;
        this.changeMustShow();
    }
    changeMustShow() {
        if (this.show) {
            if (this.must) this.level = 3;
            else this.level = 2;
        } else {
            this.must = false;
            this.level = 1;
        }
    }

    update() {
        this.selectedConditions.forEach((condition) => {
            switch (condition.type) {
                case "inventories":
                    this.inventoryIds = this.inventoryIds + "," + condition.id;
                    break;
                case "inventories":
                    this.inventoryIds = this.inventoryIds + "," + condition.id;
                    break;
                case "categories":
                    this.categoryIds = this.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.inventoryIds.substr(0, 1) === ",") this.inventoryIds = this.inventoryIds.substr(1);
        if (this.inventoryIds.substr(0, 1) === ",") this.inventoryIds = this.inventoryIds.substr(1);
        if (this.categoryIds.substr(0, 1) === ",") this.categoryIds = this.categoryIds.substr(1);

        this.store.dispatch(InventoryAttributeEditTempleteActions.update({ inventoryAttribute: this.inventoryAttribute }));
    }

    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    select(condition: any) {

        if (!this.selectedConditions.find(x => x.id === condition.id)) {
            this.selectedConditions.push(condition);
        }

        this.anyLike = "";

        this.anyLike$.next("");
        this.conditions = [];
        this.setMode("");
    }
}