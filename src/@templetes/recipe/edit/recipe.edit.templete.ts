import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as recipeReducers from "@reducers/recipe";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { RecipeEditTempleteActions } from "@actions/recipe";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { ItemsService } from "@services/items.service";
import { SearchService } from "@services/search.service";
import { Attribute } from "@entities/attribute";
import { Item } from "@entities/item";
import { AttributesService } from "@services/attributes.service";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";
import { PresentationActions } from "@actions";
@Component({
    selector: "recipeEditTemplete",
    templateUrl: "recipe.edit.templete.html",
    styleUrls: ["recipe.edit.templete.css"],
    host: { "class": "piCib" }
})
export class RecipeEditTemplete implements OnInit {
    recipe: Inventory;
    anyLike: string;
    recipeSubscription: Subscription;
    optionsSubscription: Subscription;
    currentSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    currentAttribute$: Observable<Attribute>;
    currentOwnerId$: Observable<string>;
    currentOwnerId: string;
    mode: string = "";
    loading: boolean;
    editing: string = "";
    targetValue: string;
    targetCode: string;
    categoryValues: string;
    must: boolean;
    show: boolean;
    isNew: boolean = true;
    title: string;
    attributes: Attribute[];
    currentAttribute: Attribute;
    options: any[];
    constructor(
        public inventoriesService: InventoriesService,
        public categoriesService: CategoriesService,
        public attributesService: AttributesService,
        public inventoryAttributesService: InventoryAttributesService,
        public itemsService: ItemsService,
        public attributeStore: Store<attributeReducers.State>,
        public recipeStore$: Store<recipeReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.recipeSubscription = this.recipeStore$.select(recipeReducers.recipeEditTemplete_recipe).subscribe((recipe: Inventory) => {
            
            if (!recipe) {
                this.recipe = new Inventory();
                this.isNew = true;
                delete this.recipe["position"];
            } else {
                this.recipe = { ...recipe };
                this.isNew = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.currentSubscription) this.currentSubscription.unsubscribe();
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        if (this.recipeSubscription) this.recipeSubscription.unsubscribe();
    }


    selectAttributeOk() {
        this.mode = "";
        this.options = [];
    }
    cancel() {
        this.recipeStore$.dispatch(PresentationActions.close({ message: "" }));
    }

    ngOnInit() { }

    create() {
        this.recipe.itemId = "520934b7-82ed-457e-992f-1bb0cfd3749f";
        this.recipeStore$.dispatch(RecipeEditTempleteActions.create({ recipeWithAttributes: { ...this.recipe, attributes: [] } }));
    }
}