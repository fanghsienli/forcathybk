import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { WorkOrderEditTempleteActions } from "@actions/workOrder";
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
    selector: "workOrderEditTemplete",
    templateUrl: "workOrder.edit.templete.html",
    styleUrls: ["workOrder.edit.templete.css"],
    host: { "class": "piCib" }
})
export class WorkOrderEditTemplete implements OnInit {
    workOrder: Inventory;
    anyLike: string;
    workOrderSubscription: Subscription;
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
        public workOrderStore$: Store<workOrderReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.workOrderSubscription = this.workOrderStore$.select(workOrderReducers.workOrderEditTemplete_workOrder).subscribe((workOrder: Inventory) => {
            
            if (!workOrder) {
                this.workOrder = new Inventory();
                this.isNew = true;
                delete this.workOrder["position"];
            } else {
                this.workOrder = { ...workOrder };
                this.isNew = false;
            }

            if (this.workOrder["order"]) {
                this.workOrder["orderId"] = this.workOrder["order"].id;
                this.workOrder["orderNo"] = this.workOrder["order"].no;
            }
            if (this.workOrder["recipe"]) {
                this.workOrder["recipeId"] = this.workOrder["recipe"].id;
                this.workOrder["recipeNo"] = this.workOrder["recipe"].no;
            }
            if (this.workOrder["pickupTarget"]) {
                this.workOrder["pickupTargetId"] = this.workOrder["pickupTarget"].id;
                this.workOrder["pickupTargetNo"] = this.workOrder["pickupTarget"].no;
            }

            /*
            this.currentOwnerId$ = this.workOrderStore$.select(workOrderReducers.workOrderEditTemplete_ownerId);
            if (this.currentSubscription) this.currentSubscription.unsubscribe();
            this.currentSubscription = this.currentOwnerId$.subscribe((currentOwnerId: string) => {
                this.currentOwnerId = currentOwnerId;
            });







            this.currentAttribute$ = this.workOrderStore$.select(workOrderReducers.workOrderEditTemplete_attributeId).pipe(
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
                                    //  this.workOrder["_" + _attribute.code] = await this.itemsService.find(this.workOrder[_attribute.code]).toPromise();
                                    break;
                                case "存量":
                                    //  this.workOrder["_" + _attribute.code] = await this.inventoriesService.find(this.workOrder[_attribute.code]).toPromise();
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

    ngOnDestroy() {
        if (this.currentSubscription) this.currentSubscription.unsubscribe();
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
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
    selectRecipe() {
        this.editing = "recipe";
        this.mode = "配方";
        this.optionsSubscription = this.anyLike$.pipe(
            tap(anyLike => {
                if (anyLike === "") this.options = [];
            }),
            filter(anyLike => anyLike !== ""),
            debounceTime(300),
            tap(() => { this.loading = true; }),
            switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemId: "520934b7-82ed-457e-992f-1bb0cfd3749f" }))
        ).subscribe((options: Inventory[]) => {
            this.options = options;
            this.loading = false;
        });
    }
    selectOrder(option: any) {
        this.editing = "order";
        this.mode = "訂單";
        this.optionsSubscription = this.anyLike$.pipe(
            tap(anyLike => {
                if (anyLike === "") this.options = [];
            }),
            filter(anyLike => anyLike !== ""),
            debounceTime(300),
            tap(() => { this.loading = true; }),
            switchMap(anyLike => this.inventoriesService.select({ anyLike: encodeURIComponent(anyLike), take: 5, itemId: "de69024e-b456-49f0-89a8-7bd5400d74fe" }))
        ).subscribe((options: Inventory[]) => {
            this.options = options;
            this.loading = false;
        });
    }
    selectPickupTarget(option: any) {
        this.editing = "pickupTarget";
        this.mode = "領料目標";
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




    selectOption(option: any) {
        this.workOrder[this.editing + "Id"] = option.id;
        this.workOrder[this.editing + "No"] = option.no;
        this.selectAttributeOk();
    }





    selectAttributeOk() {
        this.mode = "";
        this.options = [];
    }
    cancel() {
        this.workOrderStore$.dispatch(PresentationActions.close({ message: "" }));
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


        let inventoryAttribute = new InventoryAttribute(this.workOrder.id);/*
        //訂單
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "f12a61a7-c9a5-48ba-9af4-68ae1249406f");
        inventoryAttribute.value = this.workOrder["orderId"];
        inventoryAttributes.push(inventoryAttribute);
        */
        //配方
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "a8ba7e62-8feb-4285-aca4-ed571de603e2");
        inventoryAttribute.value = this.workOrder["recipeId"];
        inventoryAttributes.push(inventoryAttribute);        

        //產量
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "28597e59-ce72-4ff4-8a79-676d3546b13e");
        inventoryAttribute.value = this.workOrder["quantity"];
        inventoryAttributes.push(inventoryAttribute);

        /*
        //領料目標
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "4bd4d61c-f188-495b-998b-bad0e1f7b784");
        inventoryAttribute.value = this.workOrder["pickupTargetId"];
        inventoryAttributes.push(inventoryAttribute);
        //順序
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "e2c306dd-e5b0-46ff-9964-ad36312fb8ac");
        inventoryAttribute.value = this.workOrder["sort"];
        inventoryAttributes.push(inventoryAttribute);
        */

        this.workOrder.itemId = "a8867dc9-ae34-48e4-841b-bcbfc826f23b";
        this.workOrder.no = "生產 "+this.workOrder["quantity"]+" 單位的【"+this.workOrder["recipeNo"] +"】";
        this.workOrderStore$.dispatch(WorkOrderEditTempleteActions.create({ workOrderWithAttributes: { ...this.workOrder, attributes: inventoryAttributes } }));
    }

    update() {
        let inventoryAttributes = new Array<InventoryAttribute>();


        let inventoryAttribute = new InventoryAttribute(this.workOrder.id);/*
        //訂單
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "f12a61a7-c9a5-48ba-9af4-68ae1249406f");
        inventoryAttribute.value = this.workOrder["orderId"];
        inventoryAttributes.push(inventoryAttribute);
        */
        //配方
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "a8ba7e62-8feb-4285-aca4-ed571de603e2");
        inventoryAttribute.value = this.workOrder["recipeId"];
        inventoryAttributes.push(inventoryAttribute);        

        //產量
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "28597e59-ce72-4ff4-8a79-676d3546b13e");
        inventoryAttribute.value = this.workOrder["quantity"];
        inventoryAttributes.push(inventoryAttribute);

        /*
        //領料目標
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "4bd4d61c-f188-495b-998b-bad0e1f7b784");
        inventoryAttribute.value = this.workOrder["pickupTargetId"];
        inventoryAttributes.push(inventoryAttribute);
        //順序
        inventoryAttribute = new InventoryAttribute(this.workOrder.id, "e2c306dd-e5b0-46ff-9964-ad36312fb8ac");
        inventoryAttribute.value = this.workOrder["sort"];
        inventoryAttributes.push(inventoryAttribute);
        */

        this.inventoryAttributesService.select({ ownerId: this.workOrder.id }).toPromise().then((existedInventoryAttributes: InventoryAttribute[]) => {


            for (let inventoryAttribute of inventoryAttributes) {
                let existedInventoryAttribute = existedInventoryAttributes.find(x => x.targetId === inventoryAttribute.targetId);
                if (existedInventoryAttribute) {
                    inventoryAttribute.id = existedInventoryAttribute.id;
                    inventoryAttribute.startDate = existedInventoryAttribute.startDate;
                }
            }
            
            this.workOrderStore$.dispatch(WorkOrderEditTempleteActions.update({ workOrderWithAttributes: { ...this.workOrder, attributes: inventoryAttributes } }));
        });
    }
}