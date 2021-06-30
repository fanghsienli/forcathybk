import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as relationshipTargetReducers from "@reducers/relationshipTarget";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { RelationshipTargetEditTempleteActions } from "@actions/relationshipTarget";
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
    selector: "relationshipTargetEditTemplete",
    templateUrl: "relationshipTarget.edit.templete.html",
    styleUrls: ["relationshipTarget.edit.templete.css"],
    host: { "class": "piCib" }
})
export class RelationshipTargetEditTemplete implements OnInit {
    relationshipTarget: Inventory;
    anyLike: string;
    relationshipTargetSubscription: Subscription;
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
        public relationshipTargetStore$: Store<relationshipTargetReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.relationshipTargetSubscription = this.relationshipTargetStore$.select(relationshipTargetReducers.relationshipTargetEditTemplete_relationshipTarget).subscribe((relationshipTarget: Inventory) => {
            if (!relationshipTarget) {
                this.relationshipTarget = new Inventory();
                this.isNew = true;
                delete this.relationshipTarget["position"];
            } else {
                this.relationshipTarget = { ...relationshipTarget };
                this.isNew = false;
            }


            this.currentOwnerId$ = this.relationshipTargetStore$.select(relationshipTargetReducers.relationshipTargetEditTemplete_ownerId);
            if (this.currentSubscription) this.currentSubscription.unsubscribe();
            this.currentSubscription = this.currentOwnerId$.subscribe((currentOwnerId: string) => {
                this.currentOwnerId = currentOwnerId;
            });







            this.currentAttribute$ = this.relationshipTargetStore$.select(relationshipTargetReducers.relationshipTargetEditTemplete_attributeId).pipe(
                switchMap((id: string) =>

                    this.attributeStore.select(attributeReducers.attributeEntities_attribute(), { id })
                ));
            this.currentSubscription.add(
                this.currentAttribute$.subscribe((currentAttribute: Attribute) => {
                    this.currentAttribute = currentAttribute;
                    this.attributesService.select({ itemIds: currentAttribute.itemIds }).toPromise().then(async (attributes: Attribute[]) => {
                        this.attributes = attributes.filter(x => x.code !== "ownerAttribute" && x.code !== "owner");
                        for (let _attribute of this.attributes) {
                            switch (_attribute.valueType) {
                                case "品項":
                                    //  this.relationshipTarget["_" + _attribute.code] = await this.itemsService.find(this.relationshipTarget[_attribute.code]).toPromise();
                                    break;
                                case "存量":
                                    //  this.relationshipTarget["_" + _attribute.code] = await this.inventoriesService.find(this.relationshipTarget[_attribute.code]).toPromise();
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                })
            );
        });
    }

    ngOnDestroy() {
        if (this.currentSubscription) this.currentSubscription.unsubscribe();
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        if (this.relationshipTargetSubscription) this.relationshipTargetSubscription.unsubscribe();
    }

    selectAttribute(attribute: Attribute) {
        this.mode = attribute.value;
        this.editing = attribute.code;
        this.anyLike$.next("");
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe(); 
        switch (attribute.valueType) {
            case "品項":
                this.optionsSubscription = this.anyLike$.pipe(
                    tap(anyLike => {
                        if (anyLike === "") this.options = [];
                    }),
                    filter(anyLike => anyLike !== ""),
                    debounceTime(300),
                    tap(() => { this.loading = true; }),
                    switchMap(anyLike => this.itemsService.select({ anyLike: encodeURIComponent(anyLike), take: 5, categoryIds: attribute.categoryIds || "" }))
                ).subscribe((options: Item[]) => {
                    this.options = options;
                    this.loading = false;
                });
                break;
            case "存量":
                this.optionsSubscription = this.anyLike$.pipe(
                    tap(anyLike => {
                        if (anyLike === "") this.options = [];
                    }),
                    filter(anyLike => anyLike !== ""),
                    debounceTime(300),
                    tap(() => { this.loading = true; }),
                    switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemIds: attribute.itemIds || "", inventoryIds: attribute.inventoryIds || "", categoryIds: attribute.categoryIds || "" }))
                ).subscribe((options: Inventory[]) => {
                    this.options = options;
                    this.loading = false;
                });
                break;
            default:
                break;
        }


    }

    selectOption(option: any) {
        this.relationshipTarget[this.editing] = { ...option };
        this.selectAttributeOk();
    }

    selectAttributeOk() {
        this.mode = "";
        this.options = [];
    }

    cancel() {
        this.relationshipTargetStore$.dispatch(PresentationActions.close({ message: "" }));
    }

    hasError() {
        return false;
    }

    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    ngOnInit() { }

    create() {
        let inventoryAttributes = new Array<InventoryAttribute>();
        let inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
        switch (this.currentAttribute.valueType) {
            case "細節":
                //特化
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                delete this.relationshipTarget["owner"];
                delete this.relationshipTarget["ownerAttribute"];
                //特化 輸入輸出品項數量與單位                
                if (this.relationshipTarget["inputItem"]) this.relationshipTarget.no = this.relationshipTarget["inputItem"].value;
                if (this.relationshipTarget["outputItem"]) this.relationshipTarget.no = this.relationshipTarget["outputItem"].value;
                if (this.relationshipTarget["quantity"]) this.relationshipTarget.no += this.relationshipTarget["quantity"];
                if (this.relationshipTarget["unit"]) this.relationshipTarget.no += this.relationshipTarget["unit"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "940f7ca9-1c56-468c-a9b9-af9eade03872");
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            case "關聯":
                //特化
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                delete this.relationshipTarget["owner"];
                delete this.relationshipTarget["ownerAttribute"];
                //特化 可用工作站點
                if (this.relationshipTarget["target"]) this.relationshipTarget.no = this.relationshipTarget["target"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "940f7ca9-1c56-468c-a9b9-af9eade03872");
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            default:
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                break;
        }
        for (let attribute of this.attributes) {
            let inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, attribute.id);
            switch (attribute.valueType) {
                case "品項":
                    inventoryAttribute.value = this.relationshipTarget[attribute.code].id;
                    break;
                case "存量":
                    inventoryAttribute.value = this.relationshipTarget[attribute.code].id;
                    break;
                default:
                    inventoryAttribute.value = this.relationshipTarget[attribute.code];
                    break;
            }
            inventoryAttributes.push(inventoryAttribute);
            delete this.relationshipTarget[attribute.code];
        }
        this.relationshipTargetStore$.dispatch(RelationshipTargetEditTempleteActions.create({ relationshipTargetWithAttributes: { ...this.relationshipTarget, attributes: inventoryAttributes } }));
    }

    update() {
        let inventoryAttributes = new Array<InventoryAttribute>();
        let inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
        switch (this.currentAttribute.valueType) {
            case "細節":
                //特化
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                delete this.relationshipTarget["owner"];
                delete this.relationshipTarget["ownerAttribute"];
                //特化 輸入輸出品項數量與單位      
                if (this.relationshipTarget["inputItem"]) this.relationshipTarget.no = this.relationshipTarget["inputItem"].value;
                if (this.relationshipTarget["outputItem"]) this.relationshipTarget.no = this.relationshipTarget["outputItem"].value;
                if (this.relationshipTarget["quantity"]) this.relationshipTarget.no += this.relationshipTarget["quantity"];
                if (this.relationshipTarget["unit"]) this.relationshipTarget.no += this.relationshipTarget["unit"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "940f7ca9-1c56-468c-a9b9-af9eade03872");
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            case "關聯":
                //特化
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                delete this.relationshipTarget["owner"];
                delete this.relationshipTarget["ownerAttribute"];
                //特化 可用工作站點
                if (this.relationshipTarget["target"]) this.relationshipTarget.no = this.relationshipTarget["target"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019");
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, "940f7ca9-1c56-468c-a9b9-af9eade03872");
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            default:
                this.relationshipTarget.itemId = this.currentAttribute.itemIds;
                break; 
        }
        this.inventoryAttributesService.select({ ownerId: this.relationshipTarget.id }).toPromise().then((existedInventoryAttributes: InventoryAttribute[]) => {
            
            for (let attribute of this.attributes) {
                let inventoryAttribute = new InventoryAttribute(this.relationshipTarget.id, attribute.id);
                let existedInventoryAttribute = existedInventoryAttributes.find(x => x.targetId === attribute.id);
                if (existedInventoryAttribute) {
                    inventoryAttribute.id = existedInventoryAttribute.id;
                    inventoryAttribute.startDate = existedInventoryAttribute.startDate;
                }
                switch (attribute.valueType) {
                    case "品項":
                        inventoryAttribute.value = this.relationshipTarget[attribute.code].id;
                        break;
                    case "存量":
                        inventoryAttribute.value = this.relationshipTarget[attribute.code].id;
                        break;
                    default:
                        inventoryAttribute.value = this.relationshipTarget[attribute.code];
                        break;
                }
                inventoryAttributes.push(inventoryAttribute);
                delete this.relationshipTarget[attribute.code];
            }
            this.relationshipTargetStore$.dispatch(RelationshipTargetEditTempleteActions.update({ relationshipTargetWithAttributes: { ...this.relationshipTarget, attributes: inventoryAttributes } }));
        });
    }
}