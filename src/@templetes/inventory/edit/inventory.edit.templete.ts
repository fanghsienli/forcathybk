import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as inventoryReducers from "@reducers/inventory";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { InventoryEditTempleteActions } from "@actions/inventory";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { ItemsService } from "@services/items.service";
import { SearchService } from "@services/search.service";
import { Attribute } from "@entities/attribute";
import { Item } from "@entities/item";
import { AttributesService } from "@services/attributes.service";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";
import { PresentationActions } from "@actions";
import { Gen } from "@entities/entity";
import Swal from "sweetalert2";
@Component({
    selector: "inventoryEditTemplete",
    templateUrl: "inventory.edit.templete.html",
    styleUrls: ["inventory.edit.templete.css"],
    host: { "class": "piCib" }
})
export class InventoryEditTemplete implements OnInit {
    inventory: Inventory;
    anyLike: string;
    inventorySubscription: Subscription;
    optionsSubscription: Subscription;
    currentSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    currentAttribute$: Observable<Attribute>;
    currentItem$: Observable<Item>;
    currentItem: Item;
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
    currentAttribute: Attribute;
    options: any[];
    attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }[];
    editingAttribute: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string };
    constructor(
        public inventoriesService: InventoriesService,
        public attributesService: AttributesService,
        public categoriesService: CategoriesService,
        public inventoryAttributesService: InventoryAttributesService,
        public itemsService: ItemsService,
        public attributeStore: Store<attributeReducers.State>,
        public inventoryStore$: Store<inventoryReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.loading = true;
        this.inventorySubscription = this.inventoryStore$.select(inventoryReducers.inventoryEditTemplete_inventory).subscribe((inventory: Inventory) => {
            if (!inventory) {
                this.inventory = new Inventory();
                if (this.currentSubscription) this.currentSubscription.unsubscribe();
                this.currentSubscription = this.inventoryStore$.select(inventoryReducers.inventoryEditTemplete_item).subscribe((item: Item) => {
                    if (item) {
                        this.inventory.itemValue = item.value;
                        this.inventory.itemId = item.id;
                        this.inventory.no = `${item.code}_${Gen.newNo()}`;
                        if (this.isNew) {                           
                            this.attributesService.selectByItem(this.inventory.itemId).toPromise().then((attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds: string; categoryIds: string; inventoryIds: string }[]) => {
                                this.attributes = attributes;
                                if (this.attributes.length === 0) this.loading = false;
                                else this.setAttributes();
                                this.attributes.push({
                                    id: Gen.newGuid(),
                                    value: "",
                                    targetId: null,
                                    targetValue: "",
                                    level: 1,
                                    valueType: "文字",
                                    itemIds: "",
                                    categoryIds: "",
                                    inventoryIds: ""
                                });
                            });
                        }
                    } else this.loading = false;
                });
                this.currentSubscription.add(this.inventoryStore$.select(inventoryReducers.inventoryEditTemplete_positionTarget).subscribe((positionTarget: Inventory) => {
                    if (positionTarget) {
                        this.inventory.positionTargetNo = positionTarget.no;
                        this.inventory.positionTargetId = positionTarget.id;
                    } else {
                        this.inventory.positionTargetNo = this.appService.profile.no;
                        this.inventory.positionTargetId = this.appService.profile.id;
                    }
                }));
                this.isNew = true;
            } else {
                this.inventory = { ...inventory };
                this.attributesService.selectByInventory(this.inventory.id).toPromise().then((attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }[]) => {
                    this.attributes = attributes;
                    if (this.attributes.length === 0) this.loading = false;
                    else this.setAttributes();
                    this.attributes.push({
                        id: Gen.newGuid(),
                        value: "",
                        targetValue: "",
                        targetId: null,
                        level: 1,
                        valueType: "文字",
                        itemIds: "",
                        categoryIds: "",
                        inventoryIds: ""
                    });
                });
                this.isNew = false;
            }
            







            /*

            this.currentAttribute$ = this.inventoryStore$.select(inventoryReducers.inventoryEditTemplete_attributeId).pipe(
                switchMap((id: string) =>

                    this.attributeStore.select(attributeReducers.attributeEntities_attribute(), { id })
                ));
            this.currentSubscription.add(
                this.currentAttribute$.subscribe((currentAttribute: Attribute) => {
                    this.currentAttribute = currentAttribute;
                    this.attributesService.select({ itemIds: currentAttribute.itemIds }).toPromise().then(async (attribㄩutes: Attribute[]) => {
                        this.attributes = attributes.filter(x => x.code !== "ownerAttribute" && x.code !== "owner");
                        for (let _attribute of this.attributes) {
                            switch (_attribute.valueType) {
                                case "品項":
                                    //  this.inventory["_" + _attribute.code] = await this.itemsService.find(this.inventory[_attribute.code]).toPromise();
                                    break;
                                case "存量":
                                    //  this.inventory["_" + _attribute.code] = await this.inventoriesService.find(this.inventory[_attribute.code]).toPromise();
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                })
            );*/
        });


    }

    async setAttributes() {
        let promises = new Array<Promise<any>>();
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].value) {
                switch (this.attributes[i].valueType) {
                    case "文字":
                        break;
                    case "數值":
                        break;
                    case "時間":
                        break;
                    case "存量":
                        let observable1 = this.inventoriesService.find(this.attributes[i].value).pipe(tap(inventory => this.attributes[i]["inventoryValue"] = inventory["no"]));
                        if (observable1) promises.push(observable1.toPromise());
                        break;
                    case "細節":
                        break;
                    case "關聯":
                        break;
                    case "屬性":
                        break;
                    case "品項":
                        let observable2 = this.itemsService.find(this.attributes[i].value).pipe(tap(item => this.attributes[i]["itemValue"] = item["value"]));
                        if (observable2) promises.push(observable2.toPromise());
                        break;
                    case "分類":
                        break;
                    case "轉移":
                        break;
                    default:
                        break;
                }
            }
        }

        Promise.all(promises).then((r) => {
            this.loading = false;
        });
    }

    ngOnDestroy() {
        if (this.currentSubscription) this.currentSubscription.unsubscribe();
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        if (this.inventorySubscription) this.inventorySubscription.unsubscribe();
    }

    selectItem() {
        if (this.isNew || !this.inventory.itemId) {
            this.mode = "品項";
            if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
            this.optionsSubscription = this.anyLike$.pipe(
                tap(anyLike => {
                    if (anyLike === "") this.options = [];
                }),
                filter(anyLike => anyLike !== ""),
                debounceTime(300),
                tap(() => { this.loading = true; }),
                switchMap(anyLike => this.itemsService.select({ anyLike: encodeURIComponent(anyLike), take: 5 }))
            ).subscribe((options: Item[]) => {
                this.options = options;
                this.loading = false;
            });
        }
    }

    selectPosition() {
        if (this.isNew || !this.inventory.positionId) {
            this.mode = "位置";
            if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
            this.optionsSubscription = this.anyLike$.pipe(
                tap(anyLike => {
                    if (anyLike === "") this.options = [];
                }),
                filter(anyLike => anyLike !== ""),
                debounceTime(300),
                tap(() => { this.loading = true; }),
                switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5 }))
            ).subscribe((options: Inventory[]) => {
                this.options = options;
                this.loading = false;
            });
        }
    }

    selectAttribute(attribute: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }) {
        this.mode = attribute.targetValue;
        this.editingAttribute = attribute;
        
        switch (attribute.valueType) {
            case "文字":
                break;
            case "數值":
                break;
            case "時間":
                break;
            case "存量":
                if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
                this.optionsSubscription = this.anyLike$.pipe(
                    tap(anyLike => {
                        if (anyLike === "") this.options = [];
                    }),
                    filter(anyLike => anyLike !== ""),
                    debounceTime(300),
                    tap(() => { this.loading = true; }),
                    switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemIds: attribute.itemIds, inventoryIds: attribute.inventoryIds, categoryIds: attribute.categoryIds }))
                ).subscribe((options: Inventory[]) => {
                    this.options = options;
                    this.loading = false;
                });
                break;
            case "細節":
                break;
            case "關聯":
                break;
            case "屬性":
                break;
            case "品項":
                if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
                this.optionsSubscription = this.anyLike$.pipe(
                    tap(anyLike => {
                        if (anyLike === "") this.options = [];
                    }),
                    filter(anyLike => anyLike !== ""),
                    debounceTime(300),
                    tap(() => { this.loading = true; }),
                    switchMap(anyLike => this.itemsService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemIds: attribute.itemIds, inventoryIds: attribute.inventoryIds, categoryIds: attribute.categoryIds  }))
                ).subscribe((options: Item[]) => {
                    this.options = options;
                    this.loading = false;
                });
                break;
            case "分類":
                break;
            case "轉移":
                break;
            default:
                break;
        }
    }

    selectOption(option: any) {
        switch (this.mode) {
            case "品項":
                this.inventory.itemValue = option.value;
                this.inventory.itemId = option.id;
                this.inventory.no = `${option.code}_${Gen.newNo()}`; 
                this.loading = true;
                    if (this.isNew) {
                        this.attributesService.selectByItem(this.inventory.itemId).toPromise().then((attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds: string; categoryIds: string; inventoryIds: string }[]) => {
                            this.attributes = attributes;
                            if (this.attributes.length === 0) this.loading = false;
                            else this.setAttributes();
                            this.attributes.push({
                                id: Gen.newGuid(),
                                value: "",
                                targetId: null,
                                targetValue: "",
                                level: 1,
                                valueType: "文字",
                                itemIds: "",
                                categoryIds: "",
                                inventoryIds: ""
                            });
                        });
                    }
             















                break;
            case "位置":
                this.inventory.positionTargetId = option.id;
                this.inventory.positionTargetNo = option.no;
                break;
            default:

                switch (this.editingAttribute.valueType) {
                    case "文字":
                        break;
                    case "數值":
                        break;
                    case "時間":
                        break;
                    case "存量":
                        this.editingAttribute.value = option.id;
                        this.editingAttribute["inventoryValue"] = option.no;
                        break;
                    case "細節":
                        break;
                    case "關聯":
                        break;
                    case "屬性":
                        break;
                    case "品項":
                        this.editingAttribute.value = option.id;
                        this.editingAttribute["itemValue"] = option.value;
                        break;
                    case "分類":
                        break;
                    case "轉移":
                        break;
                    default:
                        break;
                }
                break;
        }

        this.selectOptionOk();
    }

    selectOptionOk() {
        this.mode = "";
        this.options = [];
    }

    cancel() {
        this.inventoryStore$.dispatch(PresentationActions.close({ message: "" }));
    }

    hasError() {
        return false;
    }

    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    ngOnInit() {
        this.attributes = new Array<{ id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }>();
        this.attributes.push({
            targetValue: "",
            value: "",
            id: Gen.newGuid(),
            targetId: Gen.newGuid(),
            level: 1,
            valueType: "文字",
            itemIds: "",
            categoryIds: "",
            inventoryIds: ""
        });
    }

    create() {
        this.inventory.position = new Position();
        this.inventory.position.targetId = this.inventory.positionTargetId;
        this.inventory.position.startDate = this.inventory.position.startDate.toJSON();

        let inventoryAttributes = new Array<InventoryAttribute>();
        for (let attribute of this.attributes) {
            if (attribute.targetValue !== "") {
                let inventoryAttribute = new InventoryAttribute(this.inventory.id, attribute.targetId);
                inventoryAttribute.id = attribute.id;
                inventoryAttribute.value = attribute.value;
                if (attribute.targetId === null) {
                    let target = new Attribute();
                    target.valueType = "文字";
                    target.value = attribute.targetValue;
                    target.code = attribute.targetValue;
                    inventoryAttribute.target = { ...target };
                }
                inventoryAttribute.startDate = inventoryAttribute.startDate.toJSON();
                
                inventoryAttributes.push({ ...inventoryAttribute });
            }
        }
        
        this.inventoryStore$.dispatch(InventoryEditTempleteActions.create({
            inventoryWithAttributes: {
                ...this.inventory,
                position: { ... this.inventory.position },
                attributes: inventoryAttributes
            }
        }));
    }

    update() {
        this.inventory.position = new Position(this.inventory.id);
        this.inventory.position.targetId = this.inventory.positionTargetId;
        this.inventory.position.startDate = this.inventory.position.startDate.toJSON();

        let inventoryAttributes = new Array<InventoryAttribute>();
        for (let attribute of this.attributes) {
            if (attribute.targetValue !== "") {
                let inventoryAttribute = new InventoryAttribute(this.inventory.id, attribute.targetId);
                inventoryAttribute.id = attribute.id;
                inventoryAttribute.value = attribute.value;
                if (attribute.targetId === null) {
                    let target = new Attribute();
                    target.valueType = "文字";
                    target.value = attribute.targetValue;
                    target.code = attribute.targetValue;
                    inventoryAttribute.target = { ...target };
                }
                inventoryAttribute.startDate = inventoryAttribute.startDate.toJSON();
                inventoryAttributes.push({ ...inventoryAttribute });
            }
        }

        let inventoryWithAttributes = {
            ...this.inventory,
            position: { ... this.inventory.position },
            attributes: inventoryAttributes
        };

        
        this.inventoryStore$.dispatch(InventoryEditTempleteActions.update({
            inventoryWithAttributes
        }));
    }

    blurAttribute(attribute: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }) {
        if (this.attributes.filter(x => x.targetValue === attribute.targetValue).length > 1) {

            attribute.targetValue = "";
            this.attributes = this.attributes.filter(x => x.targetValue !== "");
            this.attributes.push({
                targetValue: "",
                value: attribute.value,
                id: attribute.id,
                targetId: attribute.targetId,
                level: attribute.level,
                valueType: attribute.valueType,
                itemIds: attribute.itemIds,
                categoryIds: attribute.categoryIds,
                inventoryIds: attribute.inventoryIds
            });
        }
        else {
            this.attributes = this.attributes.filter(x => x.targetValue !== "");
            this.attributes.push({
                targetValue: "",
                value: "",
                id: Gen.newGuid(),
                targetId: null,
                level: 1,
                valueType: "文字",
                itemIds: "",
                categoryIds: "",
                inventoryIds: ""
            });
        }
    }
}