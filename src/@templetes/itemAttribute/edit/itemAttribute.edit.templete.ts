import { Component, OnInit } from "@angular/core";
import { Item, ItemAttribute } from "@entities/item";
import { Store } from "@ngrx/store";
import * as itemReducers from "@reducers/item";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { ItemAttributeEditTempleteActions } from "@actions/item";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { ItemsService } from "@services/items.service";
import { SearchService } from "@services/search.service";
import { Category } from "@entities/category";
import { Inventory } from "@entities/inventory"; 
import { PresentationActions } from "@actions";
@Component({
    selector: "itemAttributeEditTemplete",
    templateUrl: "itemAttribute.edit.templete.html",
    styleUrls: ["itemAttribute.edit.templete.css"],
    host: { "class": "piCib" }
})
export class ItemAttributeEditTemplete implements OnInit {
    itemAttribute: ItemAttribute;
    anyLike: string;
    itemAttributeSubscription: Subscription;
    itemsSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    item: Item;
    items: Item[];
    mode: string = "";
    itemAttributeTargetValue: string = "";
    loading: boolean;
    targetValue: string;
    targetCode: string;
    categoryValues: string;
    must: boolean;
    show: boolean;
    options: any[] = new Array<any>();
    conditions: any[] = new Array<any>();
    isNew: boolean = true;
    constructor(
        public inventoriesService: InventoriesService,
        public categoriesService: CategoriesService,
        public itemsService: ItemsService,
        public itemStore$: Store<itemReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) { 
        this.itemAttributeSubscription = this.itemStore$.select(itemReducers.itemAttributeEditTemplete_itemAttribute).subscribe((itemAttribute: ItemAttribute) => {
            if (!itemAttribute) {
                this.itemAttribute = new ItemAttribute();
                this.isNew = true;

                //delete this.relationshipTarget["position"];
            } else {
                this.itemAttribute = { ...itemAttribute };
                this.itemAttribute.target = { ...this.itemAttribute.target };
                this.isNew = false;
                this.itemAttributeTargetValue = this.itemAttribute.target.value;
            }
       
            switch (this.itemAttribute.target.level) {
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
                    this.must = false;
                    this.show = false;
                    break;
            }

            if (this.itemAttribute.target.itemIds) {
                let itemIds = this.itemAttribute.target.itemIds.split(",");
                itemIds.forEach((itemId: string) => {
                    this.itemsService.find(itemId).toPromise().then((item: Item) => {
                        let condition = {
                            id: item.id,
                            value: item.value,
                            desc: item.code,
                            type: "item"
                        };
                        if (!this.conditions.find(x => x.id === condition.id)) {
                            this.conditions.push(condition);
                        }
                    });
                });
                this.itemAttribute.target.itemIds = "";
            }
            if (this.itemAttribute.target.categoryIds) {
                let categoryIds = this.itemAttribute.target.categoryIds.split(",");
                categoryIds.forEach((categoryId: string) => {
                    this.categoriesService.find(categoryId).toPromise().then((category: Category) => {
                        let condition = {
                            id: category.id,
                            value: "#" + category.value,
                            desc: category.code,
                            type: "category"
                        };
                        if (!this.conditions.find(x => x.id === condition.id)) {
                            this.conditions.push(condition);
                        }
                    });
                });
                this.itemAttribute.target.categoryIds = "";
            }
            if (this.itemAttribute.target.inventoryIds) {
                let inventoryIds = this.itemAttribute.target.inventoryIds.split(",");
                inventoryIds.forEach((categoryId: string) => {
                    this.inventoriesService.find(categoryId).toPromise().then((inventory: Inventory) => {
                        let condition = {
                            id: inventory.id,
                            value: inventory.no,
                            desc: "",
                            type: "inventory"
                        };
                        if (!this.conditions.find(x => x.id === condition.id)) {
                            this.conditions.push(condition);
                        }
                    });
                });
                this.itemAttribute.target.inventoryIds = "";
            }
        });
        
    }

    ngOnDestroy() {
        if (this.itemsSubscription) this.itemsSubscription.unsubscribe();
        if (this.itemAttributeSubscription) this.itemAttributeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.itemsSubscription = this.anyLike$.pipe(
            tap(anyLike => {
                if (anyLike.length === 0) this.items = [];
            }),
            filter(valueLike => valueLike.length > 0),
            debounceTime(200),
            tap(() => { this.loading = true; }),
            switchMap(anyLike => this.searchService.selectConditions({ anyLike: encodeURIComponent(anyLike), take: 5 }))
        ).subscribe((option: any[]) => {
            this.options = option;
            this.loading = false;
        });
    }

    remove(conditionId: string) {
        this.conditions = this.conditions.filter(x => x.id !== conditionId);
        console.log(this.conditions);
    }

    hasError() {
        if (this.itemAttribute.target.value === "") return true;
        return false;
    }

    needCondition() {
        if (this.itemAttribute.target.valueType === "存量") {
            return this.conditions.filter(x => x.type === "category" || x.type === "item").length === 0;
        }
        if (this.itemAttribute.target.valueType === "品項") {
            return this.conditions.filter(x => x.type === "category").length === 0;
        }
        return false;
    }

    change(checked,valueType) {
        if (checked) {
            this.itemAttribute.target.valueType = valueType;
            if (valueType !== "數值" && valueType !== "存量") {
                this.item = null;
            }
        }
    }

    selectCondition() {
        this.mode = "條件";
        this.anyLike = "";
        this.anyLike$.next(this.anyLike);
    }

    cancel() {
        this.itemStore$.dispatch(PresentationActions.close({ message:"" }));
    }

    create() {
        this.conditions.forEach((condition) => {
            switch (condition.type) {
                case "item":
                    if (this.itemAttribute.target.itemIds.indexOf(condition.id) === -1) this.itemAttribute.target.itemIds = this.itemAttribute.target.itemIds + "," + condition.id;
                    break;
                case "inventory":
                    if (this.itemAttribute.target.inventoryIds.indexOf(condition.id) === -1) this.itemAttribute.target.inventoryIds = this.itemAttribute.target.inventoryIds + "," + condition.id;
                    break;
                case "category":
                    if (this.itemAttribute.target.categoryIds.indexOf(condition.id) === -1) this.itemAttribute.target.categoryIds = this.itemAttribute.target.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.itemAttribute.target.itemIds.substr(0, 1) === ",") this.itemAttribute.target.itemIds = this.itemAttribute.target.itemIds.substr(1);
        if (this.itemAttribute.target.inventoryIds.substr(0, 1) === ",") this.itemAttribute.target.inventoryIds = this.itemAttribute.target.inventoryIds.substr(1);
        if (this.itemAttribute.target.categoryIds.substr(0, 1) === ",") this.itemAttribute.target.categoryIds = this.itemAttribute.target.categoryIds.substr(1);
        this.itemStore$.dispatch(ItemAttributeEditTempleteActions.create({ itemAttribute: { ...this.itemAttribute } }));
    }

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
            if (this.must) this.itemAttribute.target.level = 3;
            else this.itemAttribute.target.level = 2;
        } else {
            this.must = false;
            this.itemAttribute.target.level = 1;
        }
    }

    update() {
        this.conditions.forEach((condition) => {
            switch (condition.type) {
                case "item":
                    if (this.itemAttribute.target.itemIds.indexOf(condition.id) === -1) this.itemAttribute.target.itemIds = this.itemAttribute.target.itemIds + "," + condition.id;
                    break;
                case "inventory":
                    if (this.itemAttribute.target.inventoryIds.indexOf(condition.id) === -1) this.itemAttribute.target.inventoryIds = this.itemAttribute.target.inventoryIds + "," + condition.id;
                    break;
                case "category":
                    if (this.itemAttribute.target.categoryIds.indexOf(condition.id) === -1) this.itemAttribute.target.categoryIds = this.itemAttribute.target.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.itemAttribute.target.itemIds.substr(0, 1) === ",") this.itemAttribute.target.itemIds = this.itemAttribute.target.itemIds.substr(1);
        if (this.itemAttribute.target.inventoryIds.substr(0, 1) === ",") this.itemAttribute.target.inventoryIds = this.itemAttribute.target.inventoryIds.substr(1);
        if (this.itemAttribute.target.categoryIds.substr(0, 1) === ",") this.itemAttribute.target.categoryIds = this.itemAttribute.target.categoryIds.substr(1);        
        this.itemStore$.dispatch(ItemAttributeEditTempleteActions.update({ itemAttribute: this.itemAttribute }));
    }

    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    selectOption(condition: any) {
        if (condition.type === "category" && condition.value.indexOf("#")===-1) condition.value = "#" + condition.value;
        if (!this.conditions.find(x => x.id === condition.id)) {
            this.conditions.push(condition);
        }
        this.selectConditionOk();
    }
    selectConditionOk() {
        this.anyLike = "";
        this.anyLike$.next("");
        this.mode = "";
        this.options = [];
    }

}