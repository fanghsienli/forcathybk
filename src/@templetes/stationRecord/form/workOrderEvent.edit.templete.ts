import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { WorkOrderEventEditTempleteActions } from "@actions/workOrder";
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
    selector: "workOrderEventEditTemplete",
    templateUrl: "workOrderEvent.edit.templete.html",
    styleUrls: ["workOrderEvent.edit.templete.css"],
    host: { "class": "piCib" }
})
export class WorkOrderEventEditTemplete implements OnInit {
    workOrderEvent: Inventory;
    anyLike: string;
    workOrderEventSubscription: Subscription;
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
        public workOrderEventStore$: Store<workOrderReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.workOrderEventSubscription = this.workOrderEventStore$.select(workOrderReducers.workOrderEventEditTemplete_workOrderEvent).subscribe((workOrderEvent: Inventory) => {
            if (!workOrderEvent) {
                this.workOrderEvent = new Inventory();
                this.isNew = true;
                delete this.workOrderEvent["position"];
            } else {
                this.workOrderEvent = { ...workOrderEvent };
                this.isNew = false;
            }


            this.currentOwnerId$ = this.workOrderEventStore$.select(workOrderReducers.workOrderEventEditTemplete_ownerId);
            if (this.currentSubscription) this.currentSubscription.unsubscribe();
            this.currentSubscription = this.currentOwnerId$.subscribe((currentOwnerId: string) => {
                this.currentOwnerId = currentOwnerId;
            });







            this.currentAttribute$ = this.workOrderEventStore$.select(workOrderReducers.workOrderEventEditTemplete_attributeId).pipe(
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
                                    //  this.workOrderEvent["_" + _attribute.code] = await this.itemsService.find(this.workOrderEvent[_attribute.code]).toPromise();
                                    break;
                                case "存量":
                                    //  this.workOrderEvent["_" + _attribute.code] = await this.inventoriesService.find(this.workOrderEvent[_attribute.code]).toPromise();
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
        if (this.workOrderEventSubscription) this.workOrderEventSubscription.unsubscribe();
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
                    switchMap(anyLike => this.itemsService.select({ anyLike: encodeURIComponent(anyLike), take: 5, categoryIds: attribute.categoryIds }))
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
                    switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemIds: attribute.itemIds }))
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
        this.workOrderEvent[this.editing] = { ...option };
        this.selectAttributeOk();
    }
    selectAttributeOk() {
        this.mode = "";
        this.options = [];
    }
    cancel() {
        this.workOrderEventStore$.dispatch(PresentationActions.close({ message: "" }));
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
        let inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
        switch (this.currentAttribute.valueType) {
            case "細節":
                //特化
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                delete this.workOrderEvent["owner"];
                delete this.workOrderEvent["ownerAttribute"];
                //特化 輸入輸出品項數量與單位                
                if (this.workOrderEvent["inputItem"]) this.workOrderEvent.no = this.workOrderEvent["inputItem"].value;
                if (this.workOrderEvent["outputItem"]) this.workOrderEvent.no = this.workOrderEvent["outputItem"].value;
                if (this.workOrderEvent["quantity"]) this.workOrderEvent.no += this.workOrderEvent["quantity"];
                if (this.workOrderEvent["unit"]) this.workOrderEvent.no += this.workOrderEvent["unit"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute("940f7ca9-1c56-468c-a9b9-af9eade03872", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            case "關聯":
                //特化
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                delete this.workOrderEvent["owner"];
                delete this.workOrderEvent["ownerAttribute"];
                //特化 可用工作站點
                if (this.workOrderEvent["target"]) this.workOrderEvent.no = this.workOrderEvent["target"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute("940f7ca9-1c56-468c-a9b9-af9eade03872", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            default:
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                break;
        }
        for (let attribute of this.attributes) {
            let inventoryAttribute = new InventoryAttribute(attribute.id, this.workOrderEvent.id);
            switch (attribute.valueType) {
                case "品項":
                    inventoryAttribute.value = this.workOrderEvent[attribute.code].id;
                    break;
                case "存量":
                    inventoryAttribute.value = this.workOrderEvent[attribute.code].id;
                    break;
                default:
                    inventoryAttribute.value = this.workOrderEvent[attribute.code];
                    break;
            }
            inventoryAttributes.push(inventoryAttribute);
            delete this.workOrderEvent[attribute.code];
        }
        this.workOrderEventStore$.dispatch(WorkOrderEventEditTempleteActions.create({ workOrderEventWithAttributes: { ...this.workOrderEvent, attributes: inventoryAttributes } }));
    }

    update() {
        let inventoryAttributes = new Array<InventoryAttribute>();
        let inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
        switch (this.currentAttribute.valueType) {
            case "細節":
                //特化
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                delete this.workOrderEvent["owner"];
                delete this.workOrderEvent["ownerAttribute"];
                //特化 輸入輸出品項數量與單位      
                if (this.workOrderEvent["inputItem"]) this.workOrderEvent.no = this.workOrderEvent["inputItem"].value;
                if (this.workOrderEvent["outputItem"]) this.workOrderEvent.no = this.workOrderEvent["outputItem"].value;
                if (this.workOrderEvent["quantity"]) this.workOrderEvent.no += this.workOrderEvent["quantity"];
                if (this.workOrderEvent["unit"]) this.workOrderEvent.no += this.workOrderEvent["unit"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute("940f7ca9-1c56-468c-a9b9-af9eade03872", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            case "關聯":
                //特化
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                delete this.workOrderEvent["owner"];
                delete this.workOrderEvent["ownerAttribute"];
                //特化 可用工作站點
                if (this.workOrderEvent["target"]) this.workOrderEvent.no = this.workOrderEvent["target"].no;

                //對應某屬性
                inventoryAttribute = new InventoryAttribute("c0deaa47-cc6e-4a8c-9d43-fe5a8d14e019", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentAttribute.id;
                inventoryAttributes.push(inventoryAttribute);

                //屬於某存量
                inventoryAttribute = new InventoryAttribute("940f7ca9-1c56-468c-a9b9-af9eade03872", this.workOrderEvent.id);
                inventoryAttribute.value = this.currentOwnerId;
                inventoryAttributes.push(inventoryAttribute);
                break;
            default:
                this.workOrderEvent.itemId = this.currentAttribute.itemIds;
                break; 
        }
        this.inventoryAttributesService.select({ ownerId: this.workOrderEvent.id }).toPromise().then((existedInventoryAttributes: InventoryAttribute[]) => {
            
            for (let attribute of this.attributes) {
                let inventoryAttribute = new InventoryAttribute(attribute.id, this.workOrderEvent.id);
                let existedInventoryAttribute = existedInventoryAttributes.find(x => x.targetId === attribute.id);
                if (existedInventoryAttribute) {
                    inventoryAttribute.id = existedInventoryAttribute.id;
                    inventoryAttribute.startDate = existedInventoryAttribute.startDate;
                }
                switch (attribute.valueType) {
                    case "品項":
                        inventoryAttribute.value = this.workOrderEvent[attribute.code].id;
                        break;
                    case "存量":
                        inventoryAttribute.value = this.workOrderEvent[attribute.code].id;
                        break;
                    default:
                        inventoryAttribute.value = this.workOrderEvent[attribute.code];
                        break;
                }
                inventoryAttributes.push(inventoryAttribute);
                delete this.workOrderEvent[attribute.code];
            }
            this.workOrderEventStore$.dispatch(WorkOrderEventEditTempleteActions.update({ workOrderEventWithAttributes: { ...this.workOrderEvent, attributes: inventoryAttributes } }));
        });
    }
}