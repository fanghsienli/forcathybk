import { Component, OnInit } from "@angular/core";
import { Category, CategoryAttribute } from "@entities/category";
import { Store } from "@ngrx/store";
import * as categoryReducers from "@reducers/category";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { CategoryAttributeEditTempleteActions } from "@actions/category";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { SearchService } from "@services/search.service";
import { Inventory } from "@entities/inventory"; 
import { PresentationActions } from "@actions";
import { Item } from "@entities/item";
import { ItemsService } from "@services/items.service";
@Component({
    selector: "categoryAttributeEditTemplete",
    templateUrl: "categoryAttribute.edit.templete.html",
    styleUrls: ["categoryAttribute.edit.templete.css"],
    host: { "class": "piCib" }
})
export class CategoryAttributeEditTemplete implements OnInit {
    categoryAttribute: CategoryAttribute;
    anyLike: string;
    categoryAttributeSubscription: Subscription;
    categorysSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    category: Category;
    categorys: Category[];
    mode: string = "";
    categoryAttributeTargetValue: string = "";
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
        public categoryStore$: Store<categoryReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) { 
        this.categoryAttributeSubscription = this.categoryStore$.select(categoryReducers.categoryAttributeEditTemplete_categoryAttribute).subscribe((categoryAttribute: CategoryAttribute) => {
            if (!categoryAttribute) {
                this.categoryAttribute = new CategoryAttribute();
                this.isNew = true;

                //delete this.relationshipTarget["position"];
            } else {
                this.categoryAttribute = { ...categoryAttribute };
                this.categoryAttribute.target = { ...this.categoryAttribute.target };
                this.isNew = false;
                this.categoryAttributeTargetValue = this.categoryAttribute.target.value;
            }
       
            switch (this.categoryAttribute.target.level) {
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

            if (this.categoryAttribute.target.itemIds) {
                let itemIds = this.categoryAttribute.target.itemIds.split(",");
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
                this.categoryAttribute.target.categoryIds = "";
            }
            if (this.categoryAttribute.target.categoryIds) {
                let categoryIds = this.categoryAttribute.target.categoryIds.split(",");
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
                this.categoryAttribute.target.categoryIds = "";
            }
            if (this.categoryAttribute.target.inventoryIds) {
                let inventoryIds = this.categoryAttribute.target.inventoryIds.split(",");
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
                this.categoryAttribute.target.inventoryIds = "";
            }
        });
        
    }

    ngOnDestroy() {
        if (this.categorysSubscription) this.categorysSubscription.unsubscribe();
        if (this.categoryAttributeSubscription) this.categoryAttributeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.categorysSubscription = this.anyLike$.pipe(
            tap(anyLike => {
                if (anyLike.length === 0) this.categorys = [];
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
        if (this.categoryAttribute.target.value === "") return true;
        return false;
    }

    needCondition() {
        if (this.categoryAttribute.target.valueType === "存量") {
            return this.conditions.filter(x => x.type === "item" || x.type === "category").length === 0;
        }
        if (this.categoryAttribute.target.valueType === "品項") {
            return this.conditions.filter(x => x.type === "category").length === 0;
        }
        return false;
    }

    change(checked,valueType) {
        if (checked) {
            this.categoryAttribute.target.valueType = valueType;
            if (valueType !== "數值" && valueType !== "存量") {
                this.category = null;
            }
        }
    }

    selectCondition() {
        this.mode = "條件";
        this.anyLike = "";
        this.anyLike$.next(this.anyLike);
    }

    cancel() {
        this.categoryStore$.dispatch(PresentationActions.close({ message:"" }));
    }

    create() {
        this.conditions.forEach((condition) => {
            switch (condition.type) {
                case "item":
                    if (this.categoryAttribute.target.itemIds.indexOf(condition.id) === -1) this.categoryAttribute.target.itemIds = this.categoryAttribute.target.itemIds + "," + condition.id;
                    break;
                case "inventory":
                    if (this.categoryAttribute.target.inventoryIds.indexOf(condition.id) === -1) this.categoryAttribute.target.inventoryIds = this.categoryAttribute.target.inventoryIds + "," + condition.id;
                    break;
                case "category":
                    if (this.categoryAttribute.target.categoryIds.indexOf(condition.id) === -1) this.categoryAttribute.target.categoryIds = this.categoryAttribute.target.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.categoryAttribute.target.itemIds.substr(0, 1) === ",") this.categoryAttribute.target.itemIds = this.categoryAttribute.target.itemIds.substr(1);
        if (this.categoryAttribute.target.inventoryIds.substr(0, 1) === ",") this.categoryAttribute.target.inventoryIds = this.categoryAttribute.target.inventoryIds.substr(1);
        if (this.categoryAttribute.target.categoryIds.substr(0, 1) === ",") this.categoryAttribute.target.categoryIds = this.categoryAttribute.target.categoryIds.substr(1);
        this.categoryStore$.dispatch(CategoryAttributeEditTempleteActions.create({ categoryAttribute: { ...this.categoryAttribute } }));
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
            if (this.must) this.categoryAttribute.target.level = 3;
            else this.categoryAttribute.target.level = 2;
        } else {
            this.must = false;
            this.categoryAttribute.target.level = 1;
        }
    }

    update() {
        this.conditions.forEach((condition) => {
            switch (condition.type) {
                case "item":
                    if (this.categoryAttribute.target.itemIds.indexOf(condition.id) === -1) this.categoryAttribute.target.itemIds = this.categoryAttribute.target.itemIds + "," + condition.id;
                    break;
                case "inventory":
                    if (this.categoryAttribute.target.inventoryIds.indexOf(condition.id) === -1) this.categoryAttribute.target.inventoryIds = this.categoryAttribute.target.inventoryIds + "," + condition.id;
                    break;
                case "category":
                    if (this.categoryAttribute.target.categoryIds.indexOf(condition.id) === -1) this.categoryAttribute.target.categoryIds = this.categoryAttribute.target.categoryIds + "," + condition.id;
                    break;
                default:
                    break;
            }
        });
        if (this.categoryAttribute.target.itemIds.substr(0, 1) === ",") this.categoryAttribute.target.itemIds = this.categoryAttribute.target.itemIds.substr(1);
        if (this.categoryAttribute.target.inventoryIds.substr(0, 1) === ",") this.categoryAttribute.target.inventoryIds = this.categoryAttribute.target.inventoryIds.substr(1);
        if (this.categoryAttribute.target.categoryIds.substr(0, 1) === ",") this.categoryAttribute.target.categoryIds = this.categoryAttribute.target.categoryIds.substr(1);        
        this.categoryStore$.dispatch(CategoryAttributeEditTempleteActions.update({ categoryAttribute: this.categoryAttribute }));
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