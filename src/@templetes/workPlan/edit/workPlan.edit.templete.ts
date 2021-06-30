import { Component, OnInit } from "@angular/core";
import { Inventory, InventoryAttribute, Position, Exchange } from "@entities/inventory";
import { Store } from "@ngrx/store";
import * as workPlanReducers from "@reducers/workPlan";
import * as attributeReducers from "@reducers/attribute";
import { AppService } from "@services/app.service";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, filter, switchMap, tap } from "rxjs/operators";
import { WorkPlanEditTempleteActions } from "@actions/workPlan";
import { InventoriesService } from "@services/inventories.service";
import { CategoriesService } from "@services/categories.service";
import { ItemsService } from "@services/items.service";
import { SearchService } from "@services/search.service";
import { Attribute } from "@entities/attribute";
import { Item } from "@entities/item";
import { AttributesService } from "@services/attributes.service";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";
import { PresentationActions } from "@actions";
import { OrdersService } from "@services/orders.service";
import { ExchangesService } from "@services/exchanges.service";
@Component({
    selector: "workPlanEditTemplete",
    templateUrl: "workPlan.edit.templete.html",
    styleUrls: ["workPlan.edit.templete.css"],
    host: { "class": "piCib" }
})
export class WorkPlanEditTemplete implements OnInit {
    item: Item;
    workPlan: Inventory;
    anyLike: string;
    workPlanSubscription: Subscription;
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
        public exchangesService: ExchangesService,
        public ordersService: OrdersService,
        public inventoriesService: InventoriesService,
        public categoriesService: CategoriesService,
        public attributesService: AttributesService,
        public inventoryAttributesService: InventoryAttributesService,
        public itemsService: ItemsService,
        public attributeStore: Store<attributeReducers.State>,
        public workPlanStore$: Store<workPlanReducers.State>,
        public appService: AppService,
        public searchService: SearchService
    ) {
        this.workPlanSubscription = this.workPlanStore$.select(workPlanReducers.workPlanEditTemplete_workPlan).subscribe((workPlan: Inventory) => {
            
            if (!workPlan) {
                this.workPlan = new Inventory();
                this.isNew = true;
                delete this.workPlan["position"];
            } else {
                this.workPlan = { ...workPlan };
                this.isNew = false;
            }

            if (this.workPlan["order"]) {
                this.workPlan["orderId"] = this.workPlan["order"].id;
                this.workPlan["orderNo"] = this.workPlan["order"].no;
            }
            if (this.workPlan["recipe"]) {
                this.workPlan["recipeId"] = this.workPlan["recipe"].id;
                this.workPlan["recipeNo"] = this.workPlan["recipe"].no;
            }
            if (this.workPlan["pickupTarget"]) {
                this.workPlan["pickupTargetId"] = this.workPlan["pickupTarget"].id;
                this.workPlan["pickupTargetNo"] = this.workPlan["pickupTarget"].no;
            }

            /*
            this.currentOwnerId$ = this.workPlanStore$.select(workPlanReducers.workPlanEditTemplete_ownerId);
            if (this.currentSubscription) this.currentSubscription.unsubscribe();
            this.currentSubscription = this.currentOwnerId$.subscribe((currentOwnerId: string) => {
                this.currentOwnerId = currentOwnerId;
            });







            this.currentAttribute$ = this.workPlanStore$.select(workPlanReducers.workPlanEditTemplete_attributeId).pipe(
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
                                    //  this.workPlan["_" + _attribute.code] = await this.itemsService.find(this.workPlan[_attribute.code]).toPromise();
                                    break;
                                case "存量":
                                    //  this.workPlan["_" + _attribute.code] = await this.inventoriesService.find(this.workPlan[_attribute.code]).toPromise();
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
        if (this.workPlanSubscription) this.workPlanSubscription.unsubscribe();
    }

    selectUnit() {
        this.mode = "單位";
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        this.optionsSubscription = this.anyLike$.pipe(
            debounceTime(300),
            tap(() => {
                this.options = [];
                this.loading = true;
            }),
            switchMap(anyLike => this.exchangesService.select({
                anyLike: encodeURIComponent(anyLike),
                ownerId: this.workPlan.item.unitTypeId,
                take: 5
            }))
        ).subscribe((options: Exchange[]) => {
            this.options = options;
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }

    selectItem() {
        this.mode = "品項";
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        this.optionsSubscription = this.anyLike$.pipe(
            debounceTime(300),
            tap(() => {
                this.options = [];
                this.loading = true;
            }),
            switchMap(anyLike => this.itemsService.select({
                anyLike: encodeURIComponent(anyLike),
                take: 5
            }))
        ).subscribe((options: Item[]) => {
            this.options = options;
            this.loading = false;
        });
    }

    selectOrder() {
        this.mode = "單位";
        if (this.optionsSubscription) this.optionsSubscription.unsubscribe();
        this.optionsSubscription = this.anyLike$.pipe(
            debounceTime(300),
            tap(() => {
                this.options = [];
                this.loading = true;
            }),
            switchMap(anyLike => this.inventoriesService.select({
                anyLike: encodeURIComponent(anyLike),
                itemId: "aa917cae-5aaf-4173-bd1e-ab3ab1e3393e",
                take: 5
            }))
        ).subscribe((options: Inventory[]) => {
            this.options = options;
            this.loading = false;
        });
    }

    keyup(anyLike: string) {
        this.anyLike$.next(anyLike.trim());
    }

    selectItemOk(item) {
        this.mode = "";
        this.workPlan.item = item;
        this.workPlan.itemId = item.id;
    }

    cancel() {
        this.workPlanStore$.dispatch(PresentationActions.close({ message: "" }));
    }

    hasError() {
        return false;
    }


    ngOnInit() { }

    create() {
        let inventoryAttributes = new Array<InventoryAttribute>();


        let inventoryAttribute = new InventoryAttribute(this.workPlan.id);/*
        //訂單
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "f12a61a7-c9a5-48ba-9af4-68ae1249406f");
        inventoryAttribute.value = this.workPlan["orderId"];
        inventoryAttributes.push(inventoryAttribute);
        */
        //配方
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "a8ba7e62-8feb-4285-aca4-ed571de603e2");
        inventoryAttribute.value = this.workPlan["recipeId"];
        inventoryAttributes.push(inventoryAttribute);        

        //產量
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "28597e59-ce72-4ff4-8a79-676d3546b13e");
        inventoryAttribute.value = this.workPlan["quantity"];
        inventoryAttributes.push(inventoryAttribute);

        /*
        //領料目標
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "4bd4d61c-f188-495b-998b-bad0e1f7b784");
        inventoryAttribute.value = this.workPlan["pickupTargetId"];
        inventoryAttributes.push(inventoryAttribute);
        //順序
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "e2c306dd-e5b0-46ff-9964-ad36312fb8ac");
        inventoryAttribute.value = this.workPlan["sort"];
        inventoryAttributes.push(inventoryAttribute);
        */

        this.workPlan.itemId = "a8867dc9-ae34-48e4-841b-bcbfc826f23b";
        this.workPlan.no = "生產 "+this.workPlan["quantity"]+" 單位的【"+this.workPlan["recipeNo"] +"】";
        this.workPlanStore$.dispatch(WorkPlanEditTempleteActions.create({ workPlanWithAttributes: { ...this.workPlan, attributes: inventoryAttributes } }));
    }

    update() {
        let inventoryAttributes = new Array<InventoryAttribute>();


        let inventoryAttribute = new InventoryAttribute(this.workPlan.id);/*
        //訂單
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "f12a61a7-c9a5-48ba-9af4-68ae1249406f");
        inventoryAttribute.value = this.workPlan["orderId"];
        inventoryAttributes.push(inventoryAttribute);
        */
        //配方
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "a8ba7e62-8feb-4285-aca4-ed571de603e2");
        inventoryAttribute.value = this.workPlan["recipeId"];
        inventoryAttributes.push(inventoryAttribute);        

        //產量
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "28597e59-ce72-4ff4-8a79-676d3546b13e");
        inventoryAttribute.value = this.workPlan["quantity"];
        inventoryAttributes.push(inventoryAttribute);

        /*
        //領料目標
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "4bd4d61c-f188-495b-998b-bad0e1f7b784");
        inventoryAttribute.value = this.workPlan["pickupTargetId"];
        inventoryAttributes.push(inventoryAttribute);
        //順序
        inventoryAttribute = new InventoryAttribute(this.workPlan.id, "e2c306dd-e5b0-46ff-9964-ad36312fb8ac");
        inventoryAttribute.value = this.workPlan["sort"];
        inventoryAttributes.push(inventoryAttribute);
        */

        this.inventoryAttributesService.select({ ownerId: this.workPlan.id }).toPromise().then((existedInventoryAttributes: InventoryAttribute[]) => {


            for (let inventoryAttribute of inventoryAttributes) {
                let existedInventoryAttribute = existedInventoryAttributes.find(x => x.targetId === inventoryAttribute.targetId);
                if (existedInventoryAttribute) {
                    inventoryAttribute.id = existedInventoryAttribute.id;
                    inventoryAttribute.startDate = existedInventoryAttribute.startDate;
                }
            }
            
            this.workPlanStore$.dispatch(WorkPlanEditTempleteActions.update({ workPlanWithAttributes: { ...this.workPlan, attributes: inventoryAttributes } }));
        });
    }
}