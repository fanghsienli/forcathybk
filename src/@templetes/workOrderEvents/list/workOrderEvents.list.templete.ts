import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Position, Inventory, Segmentation } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { Gen } from "@entities/entity";
import { WorkOrderEventsListTempleteActions } from "@actions/workOrder";
import { Store, select } from "@ngrx/store";
import * as workOrderReducers from "@reducers/workOrder";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { Attribute } from "@entities/attribute";
@Component({
    selector: "workOrderEventsListTemplete",
    templateUrl: "workOrderEvents.list.templete.html",
    styleUrls: ["workOrderEvents.list.templete.css"]
})
export class WorkOrderEventsListTemplete implements OnInit {
    hoverId: string;
    action: string;
    idChangeSubscription: Subscription;
    actionSubscription: Subscription;
    workOrderEventsSubscription: Subscription;
    @ViewChild("exportTable") exportTable: ElementRef;
    activatedRouteSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    loading$: Observable<boolean>;
    @Input() workOrder: Inventory;
    mode: string;
    modeSubscription: Subscription;
    maxPage: number = 1;
    orderBy: any;
    descending: boolean;
    loading: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 15;
    workOrderEvents: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedWorkOrderEvent: Inventory;
    presentationSubscription: Subscription;
    groups: any[];
    expendId: string;
    workOrderEventId: string;
    workOrderEventSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public inventoriesService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public i: PositionsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private workOrderStore$: Store<workOrderReducers.State>,
        private attributeStroe: Store<attributeReducers.State>) {
        this.workOrderStore$.dispatch(WorkOrderEventsListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.workOrderStore$.select(workOrderReducers.workOrderEventsListTemplete_total);
        this.workOrderEvents = new Array<Inventory>();
    }

    openInventory(inventoryId: string) {

        window.open(`inventories/${inventoryId}`);
    }

    getWorkOrderEvents(): Promise<any[]> {
        return new Promise((resolve) => this.inventoriesService.selectList({
            query: `592473a1-95d0-49cd-87bf-120c5f682204_eq_${this.workOrder.id}`,//_and_c144726c-16f9-477d-ae85-610303dbf0a1_eq_pickup`,
            itemId: "f318dbd8-d500-4390-b9c1-2f112c157d1a"
        }).pipe(map(x => x.result)).toPromise().then((workOrderEvents: Inventory[]) => {
            let workOrderEventDetailPromises = [];
            for (let workOrderEvent of workOrderEvents) {
                workOrderEventDetailPromises.push(this.inventoriesService.findDetails(workOrderEvent.id).pipe(map((workOrderEventDetails: Inventory) =>
                    ({ ...workOrderEvent, ...workOrderEventDetails })
                )).toPromise());
            }
            Promise.all(workOrderEventDetailPromises).then((workOrderEvents) => {
                console.log(workOrderEvents);
                resolve(workOrderEvents);
            });
        }));
    }

    setGroups(_items: any[]): Promise<any[]> {
        return new Promise((resolve) => {
            let promises = [];
            for (let _item of _items) {
                promises.push(new Promise((resolve) => {
                    this.inventoriesService.findDetails(_item.id).toPromise().then((itemDetails: Inventory) => {
                        let item = { ..._item, ...itemDetails };
                        item["workOrderEvents"] = [];
                        if (this.mode === "inspection") {
                            item["workOrderEventsTotal"] = 0;
                        } else {
                            item["workOrderEventsPickupsTotal"] = 0;
                            if (this.mode === "startup") {
                                item["workOrderEventsStartupsTotal"] = 0;
                            }
                        }
                        resolve(item);
                    });
                }));
            }
            Promise.all(promises).then((items) => {
                resolve(items);
            });
        });
    }


    getInventories(workOrderEvent: any): Promise<any[]> {
        return new Promise((resolve) => {
            if (workOrderEvent["inventoryIds"]) {
                let inventoryIds = workOrderEvent["inventoryIds"].split(",");
                let promises = [];
                for (let inventoryId of inventoryIds) {
                    promises.push(new Promise((resolve) => {
                        this.inventoriesService.find(inventoryId).toPromise().then((inventory: Inventory) => {
                            this.inventoriesService.findDetails(inventory.id).toPromise().then((inventoryDetails: Inventory) => {
                                resolve({ ...inventory, ...inventoryDetails });
                            });
                        });
                    }));
                }
                Promise.all(promises).then((inventories) => {
                    resolve(inventories);
                });
            } else resolve([]);
        });
    }

    getInventory(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.inventoriesService.find(id).toPromise().then((inventory: Inventory) => {
                this.inventoriesService.findDetails(inventory.id).toPromise().then((inventoryDetails: Inventory) => {
                    resolve({ ...inventory, ...inventoryDetails });
                });
            });
        });
    }

    ngOnInit() {
        if (this.modeSubscription) this.modeSubscription.unsubscribe();
        this.modeSubscription = this.workOrderStore$.select(workOrderReducers.workOrderViewPage_mode).subscribe(async (mode) => {
            this.mode = mode;
            this.loading = true;
            let workOrderEvents = await this.getWorkOrderEvents();
            let recipe = await this.inventoriesService.findDetails(this.workOrder["recipe"].id).toPromise();
            if (this.mode === "inspection") {
                this.groups = await this.setGroups(recipe["outputs"]);
                for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "inspection")) {
                    let inspections = await this.getInventories(workOrderEvent);
                    let total = 0;
                    workOrderEvent["inspections"] = new Array<any>();
                    for (let inspection of inspections) {
                        inspection["type"] = "";
                        for (var attribute in inspection) {
                            if (attribute !== "id" &&
                                attribute !== "type" &&
                                attribute !== "no" &&
                                attribute !== "value" &&
                                attribute !== "originalValue" &&
                                attribute !== "photo" &&
                                attribute !== "itemId" &&
                                attribute !== "itemValue" &&
                                attribute !== "positionId" &&
                                attribute !== "positionTargetId" &&
                                attribute !== "positionTargetNo" &&
                                attribute !== "positionTargetPhoto" &&
                                attribute !== "positionCreatedById" &&
                                attribute !== "positionCreatedByNo" &&
                                attribute !== "positionPreOwnerId" &&
                                attribute !== "positionPreOwnerNo" &&
                                attribute !== "positionStartDate"
                            ) {
                                inspection["type"] = inspection["type"] + ", " + attribute;
                            }
                        }
                        inspection["type"] = inspection["type"].substr(2);
                        if (inspection["type"] === "" || inspection["type"] === "合格") {
                            total += inspection.value;
                        }
                        workOrderEvent["inspections"].push(inspection);
                    }
                    workOrderEvent["inspection"] = { ...workOrderEvent["inspections"][0] };
                    workOrderEvent["inspection"].value = total;
                    for (let i = 0; i < this.groups.length; i++) {
                        if (this.groups[i]["outputItem"].id === workOrderEvent["inspection"].itemId) {
                            if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                this.groups[i]["workOrderEventsTotal"] += total;
                            }
                        }
                        this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["inspection"]["positionStartDate"]).getTime()) - (new Date(a["inspection"]["positionStartDate"]).getTime()));
                    }
                }
                this.loading = false;
            }
            else {
                if (this.mode === "pickup") {
                    this.groups = await this.setGroups(recipe["inputs"]);
                    for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "pickup")) {
                        let pickups = await this.getInventories(workOrderEvent);
                        workOrderEvent["pickup"] = pickups[0];
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["pickup"]["itemId"] === this.groups[i]["inputItem"]["id"]) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                    this.groups[i]["workOrderEventsPickupsTotal"] += pickups[0]["originalValue"];
                                }
                            }
                            this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["pickup"]["positionStartDate"]).getTime()) - (new Date(a["pickup"]["positionStartDate"]).getTime()));
                        }
                    }
                }
                if (this.mode === "startup") {
                    this.groups = await this.setGroups(recipe["inputs"]);
                    for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "pickup")) {
                        let pickups = await this.getInventories(workOrderEvent);
                        workOrderEvent["pickup"] = pickups[0];
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["pickup"]["itemId"] === this.groups[i]["inputItem"]["id"]) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    this.groups[i]["workOrderEventsPickupsTotal"] += pickups[0]["originalValue"];
                                }
                            }
                        }
                    }

                    for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "startup")) {
                        let startups = await this.getInventories(workOrderEvent);
                        workOrderEvent["startup"] = startups[0];
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["startup"]["itemId"] === this.groups[i]["inputItem"]["id"]) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                    this.groups[i]["workOrderEventsStartupsTotal"] += startups[0]["originalValue"];
                                }
                            }
                            this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["startup"]["positionStartDate"]).getTime()) - (new Date(a["startup"]["positionStartDate"]).getTime()));
                        }
                    }
                }
                if (this.mode === "station") {
                    this.groups = [];
                    for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "startup")) {
                        let startups = await this.getInventories(workOrderEvent);
                        if (!this.groups.find(x => x.id === startups[0].positionTargetId)) {
                            let group = await this.getInventory(startups[0].positionTargetId);
                            group["workOrderEvents"] = new Array<any>();
                            group.status = "未開工";
                            this.groups.push(group);
                        }
                    }
                    
                    for (let workOrderEvent of workOrderEvents.filter(x => x.eventType === "station")) {

                        workOrderEvent["open"] = false;
                        if (workOrderEvent["action"] === "暫停生產") {
                            workOrderEvent["reason"] = "";
                            for (var attribute in workOrderEvent) {
                                if (attribute !== "id" &&
                                    attribute !== "no" &&
                                    attribute !== "stationId" &&
                                    attribute !== "workOrder" &&
                                    attribute !== "eventType" &&
                                    attribute !== "createdDate" &&
                                    attribute !== "createdByNo" &&
                                    attribute !== "action" &&
                                    attribute !== "usedPower" &&
                                    attribute !== "memo" &&
                                    attribute !== "reason" &&
                                    attribute !== "open" &&
                                    attribute !== "value" &&
                                    attribute !== "photo" &&
                                    attribute !== "itemId" &&
                                    attribute !== "itemValue" &&
                                    attribute !== "positionId" &&
                                    attribute !== "positionTargetId" &&
                                    attribute !== "positionTargetNo" &&
                                    attribute !== "positionCreatedById" &&
                                    attribute !== "positionCreatedByNo" &&
                                    attribute !== "positionPreOwnerId" &&
                                    attribute !== "positionPreOwnerNo" &&
                                    attribute !== "positionStartDate"
                                ) {
                                    workOrderEvent["reason"] = workOrderEvent["reason"] + ", " + attribute;
                                }
                            }
                            workOrderEvent["reason"] = workOrderEvent["reason"].substr(1);
                        }
                        
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["stationId"] === this.groups[i].id) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    this.groups[i]["workOrderEvents"].push({ ...workOrderEvent });
                                }
                            }
                           
                            this.groups[i].status = "生產中...";
                            this.groups[i]["reason"] = "";
                            if(this.groups[i]["workOrderEvents"].length === 0) this.groups[i].status = "未開工";
                            else {
                                this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["createdDate"]).getTime()) - (new Date(a["createdDate"]).getTime()));
                                if (this.groups[i]["workOrderEvents"][0]["action"] === "暫停生產") {
                                    this.groups[i].status = "生產暫停";
                                    this.groups[i]["reason"] = this.groups[i]["workOrderEvents"][0]["reason"];
                                }
                                if (this.groups[i]["workOrderEvents"][0]["action"] === "中止生產") {
                                    this.groups[i].status = "生產中止, 生產資源釋放";
                                } 
                            }
                        }


                    }
                }
                this.loading = false;
                console.log(this.groups);
            }
        });

        this.workOrderEventSubscription = this.appService.workOrderEvent$.subscribe(async (workOrderEvent) => {
            if (workOrderEvent && workOrderEvent["eventType"]) {
                this.loading = true;
                switch (workOrderEvent["eventType"]) {
                    case "inspection":
                        let inspections = await this.getInventories(workOrderEvent);
                        let total = 0;
                        workOrderEvent["inspections"] = new Array<any>();
                        for (let inspection of inspections) {
                            inspection["type"] = "";

                            for (var attribute in inspection) {
                                if (attribute !== "id" &&
                                    attribute !== "type" &&
                                    attribute !== "no" &&
                                    attribute !== "value" &&
                                    attribute !== "originalValue" &&
                                    attribute !== "photo" &&
                                    attribute !== "itemId" &&
                                    attribute !== "itemValue" &&
                                    attribute !== "positionId" &&
                                    attribute !== "positionTargetId" &&
                                    attribute !== "positionTargetNo" &&
                                    attribute !== "positionTargetPhoto" &&
                                    attribute !== "positionCreatedById" &&
                                    attribute !== "positionCreatedByNo" &&
                                    attribute !== "positionPreOwnerId" &&
                                    attribute !== "positionPreOwnerNo" &&
                                    attribute !== "positionStartDate"
                                ) {
                                    inspection["type"] = inspection["type"] + ", " + attribute;
                                }
                            }

                            inspection["type"] = inspection["type"].substr(2);
                            if (inspection["type"] === "" || inspection["type"] === "合格") {
                                total += inspection.value;
                            }
                            workOrderEvent["inspections"].push(inspection);
                        }
                        workOrderEvent["inspection"] = { ...workOrderEvent["inspections"][0] };
                        workOrderEvent["inspection"].value = total;
                        workOrderEvent["open"] = true;
                        for (let i = 0; i < this.groups.length; i++) {
                            if (this.groups[i]["outputItem"].id === workOrderEvent["inspection"].itemId) {
                                this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                this.groups[i]["workOrderEventsTotal"] += total;
                            }
                            this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["inspection"]["positionStartDate"]).getTime()) - (new Date(a["inspection"]["positionStartDate"]).getTime()));
                        }
                        this.loading = false;
                        break;
                    case "pickup":
                        let pickups = await this.getInventories(workOrderEvent);
                        workOrderEvent["pickup"] = pickups[0];
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["pickup"]["itemId"] === this.groups[i]["inputItem"]["id"]) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    if (this.mode === "pickup") this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                    this.groups[i]["workOrderEventsPickupsTotal"] += pickups[0]["originalValue"];
                                }
                            }
                            this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["pickup"]["positionStartDate"]).getTime()) - (new Date(a["pickup"]["positionStartDate"]).getTime()));
                        }
                        this.loading = false;
                        break;
                    case "startup":
                        let startups = await this.getInventories(workOrderEvent);
                        workOrderEvent["startup"] = startups[0];
                        for (let i = 0; i < this.groups.length; i++) {
                            if (workOrderEvent["startup"]["itemId"] === this.groups[i]["inputItem"]["id"]) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    this.groups[i]["workOrderEvents"].push(workOrderEvent);
                                    this.groups[i]["workOrderEventsStartupsTotal"] += startups[0]["originalValue"];
                                }
                            }
                            this.groups[i]["workOrderEvents"] = this.groups[i]["workOrderEvents"].sort((a, b) => (new Date(b["startup"]["positionStartDate"]).getTime()) - (new Date(a["startup"]["positionStartDate"]).getTime()));
                        }
                        this.loading = false;
                        break;
                    case "station":
                        workOrderEvent["open"] = false;
                        if (workOrderEvent["action"] === "暫停生產") {
                            workOrderEvent["reason"] = "";
                            for (var attribute in workOrderEvent) {
                                if (attribute !== "id" &&
                                    attribute !== "no" &&
                                    attribute !== "stationId" &&
                                    attribute !== "workOrder" &&
                                    attribute !== "eventType" &&
                                    attribute !== "createdDate" &&
                                    attribute !== "createdByNo" &&
                                    attribute !== "action" &&
                                    attribute !== "usedPower" &&
                                    attribute !== "memo" &&
                                    attribute !== "reason" &&
                                    attribute !== "open" &&
                                    attribute !== "value" &&
                                    attribute !== "photo" &&
                                    attribute !== "itemId" &&
                                    attribute !== "itemValue" &&
                                    attribute !== "positionId" &&
                                    attribute !== "positionTargetId" &&
                                    attribute !== "positionTargetNo" &&
                                    attribute !== "positionCreatedById" &&
                                    attribute !== "positionCreatedByNo" &&
                                    attribute !== "positionPreOwnerId" &&
                                    attribute !== "positionPreOwnerNo" &&
                                    attribute !== "positionStartDate"
                                ) {
                                    workOrderEvent["reason"] = workOrderEvent["reason"] + ", " + attribute;
                                }
                            }
                            workOrderEvent["reason"] = workOrderEvent["reason"].substr(1);
                        }

                        for (let i = 0; i < this.groups.length; i++) {
                            let workOrderEvents = new Array<any>();
                            for (let workOrderEvent of this.groups[i]["workOrderEvents"]) {
                                workOrderEvents.push({ ...workOrderEvent, ...{ open: false } });
                            }

                            if (workOrderEvent["stationId"] === this.groups[i].id) {
                                if (!this.groups[i]["workOrderEvents"].find(x => x.id === workOrderEvent.id)) {
                                    workOrderEvents.push({ ...workOrderEvent });
                                }
                            }
                            this.groups[i]["workOrderEvents"] = null;
                            this.groups[i]["workOrderEvents"] = workOrderEvents.sort((a, b) => (new Date(b["createdDate"]).getTime()) - (new Date(a["createdDate"]).getTime()));

                            this.groups[i].status = "生產中...";
                            this.groups[i]["reason"] = "";
                            if (this.groups[i]["workOrderEvents"][0]["action"] === "暫停生產") {
                                this.groups[i].status = "生產暫停";
                                this.groups[i]["reason"] = this.groups[i]["workOrderEvents"][0]["reason"];
                            }
                            if (this.groups[i]["workOrderEvents"][0]["action"] === "中止生產") {
                                this.groups[i].status = "生產中止, 資源釋放";
                            }
                            if (this.groups[i]["workOrderEvents"].length === 0) this.groups[i].status = "未開工";
                        }
                        this.loading = false;
                        break;
                    default:
                        break;
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.workOrderEventSubscription) this.workOrderEventSubscription.unsubscribe();
    }

    toggle(id) {
        if (this.expendId === id) this.expendId = "";
        else this.expendId = id;
    }

    more(group: any) {
        let buttons = [];
        let limit = 0;
        switch (this.mode) {
            case "station":
                switch (group.status) {
                    case "未開工":
                        buttons = [
                            {
                                color: "blue",
                                title: "開始生產",
                                action: WorkOrderEventsListTempleteActions.startStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            }
                        ];
                        break;
                    case "生產中...":
                        buttons = [
                            {
                                color: "blue",
                                title: "暫停生產",
                                action: WorkOrderEventsListTempleteActions.pauseStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            },
                            {
                                color: "red",
                                title: "終止生產",
                                action: WorkOrderEventsListTempleteActions.stopStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            }
                        ];
                        break;
                    case "生產暫停":
                        buttons = [
                            {
                                color: "blue",
                                title: "恢復生產",
                                action: WorkOrderEventsListTempleteActions.resumeStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            },
                            {
                                color: "red",
                                title: "終止生產",
                                action: WorkOrderEventsListTempleteActions.stopStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            }
                        ];
                        break;
                    case "生產中止, 生產資源釋放":
                        buttons = [
                            {
                                color: "blue",
                                title: "開始生產",
                                action: WorkOrderEventsListTempleteActions.startStation,
                                params: {
                                    workOrder: { ...this.workOrder },
                                    station: { ...group }
                                }
                            }
                        ];
                        break;
                    default:
                        break;
                }
                break;
            case "pickup":
                limit = this.workOrder["quantity"] * group["quantity"] - group["workOrderEventsPickupsTotal"];
                buttons = [
                    {
                        color: "blue",
                        title: "領料",
                        action: WorkOrderEventsListTempleteActions.pickup,
                        params: {
                            workOrder: { ...this.workOrder },
                            item: { ...group["inputItem"] },
                            limit: limit
                        }
                    }
                ];
                break;
            case "startup":
                limit = group["workOrderEventsPickupsTotal"] - group["workOrderEventsStartupsTotal"];
                buttons = [
                    {
                        color: "blue",
                        title: "投料",
                        action: WorkOrderEventsListTempleteActions.startup,
                        params: {
                            workOrder: { ...this.workOrder },
                            item: { ...group["inputItem"] },
                            limit: limit
                        }
                    }
                ];
                break;
            case "inspection":
                buttons = [
                    {
                        color: "blue",
                        title: "檢查",
                        action: WorkOrderEventsListTempleteActions.inspection,
                        params: {
                            workOrder: { ...this.workOrder },
                            item: { ...group["outputItem"] }
                        }
                    }
                ];
                break;
            default:
                break;
        }
        this.workOrderStore$.dispatch(WorkOrderEventsListTempleteActions.more({ buttons }));
    }
}