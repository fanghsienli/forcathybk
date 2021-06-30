import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { InventoriesService } from "@services/inventories.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DialogService } from "@services/dialog.service";
import { Position, Inventory, Segmentation } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import * as inventoryReducers from "@reducers/inventory";
import { SegmentationsService } from "@services/segmentations.service";
import { InventoryViewPageActions, InventoriesListTempleteActions } from "@actions/inventory";
import { map } from "rxjs/operators";
import { Gen } from "@entities/entity";
import * as XLSX from "xlsx";
import { ItemsService } from "@services/items.service";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
import { PresentationActions } from "@actions";
import { AttributesService } from "@services/attributes.service";
@Component({
    selector: "inventoryViewPage",
    templateUrl: "inventory.view.page.html",
    styleUrls: ["inventory.view.page.css"],
    host: { "class": "SCxLW uzKWK", "style": "padding-bottom:44px" }
})
export class InventoryViewPage implements OnInit {
    activatedRouteSubscription: Subscription;
    params: any;
    ngOnInitSubscription: Subscription;
    paramsSubscription: Subscription;
    inventoryGridsFilter: any;
    inventory: Inventory;
    presentationSubscription: Subscription;
    positionSubscription: Subscription;
    inventoryGridSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    position$: Observable<Position> = this.appService.position$;
    action: string;
    actionSubscription: Subscription;
    inventory$: BehaviorSubject<Inventory> = new BehaviorSubject<Inventory>(null);
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    inventorySubscription: Subscription;
    actionsSubscription: Subscription;
    loading: boolean;
    mode$: Observable<string>;
    attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }[];
    constructor(
        public filesService: FilesService,
        public attributesService: AttributesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public folderFilesService: FolderFilesService,
        public dialogService: DialogService,
        public positionsService: PositionsService,
        public segmentationsService: SegmentationsService,
        public inventoryStore$: Store<inventoryReducers.State>,
        public store$: Store<reducers.State>,
        public itemsService: ItemsService,
        route: ActivatedRoute
    ) {

        this.attributes = new Array<{ id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }>();
        this.actionsSubscription = route.params.pipe(
            map(params => InventoryViewPageActions.setId({ id: params.id }))
        ).subscribe(
            action => inventoryStore$.dispatch(action)
        );
        this.loading = true;
        this.inventoryStore$.dispatch(InventoryViewPageActions.setMode({ mode: "inventoriesList" }));
        this.mode$ = inventoryStore$.pipe(select(inventoryReducers.inventoryViewPageMode));
    }
    setMode(mode: string) {
        this.inventoryStore$.dispatch(InventoryViewPageActions.setMode({ mode }));
    }
    nextAction(action: string) {
        this.appService.action$.next(action);
    }

    ngOnDestroy() {
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.inventorySubscription) this.inventorySubscription.unsubscribe();
        if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    openPrint(inventoryId: string) {
        window.open(`print/inventories/${inventoryId}`);
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    goToInventory(inventoryId: string) {

        this.router.navigate([`inventories/${inventoryId}`]);
    }

    goToInventoriesPrint(inventoryId: string) {
        this.router.navigate([`inventories/${inventoryId}/edit`]);
    }

    openCategory(categoryId: string) {
        window.open(`categorys/${categoryId}`);
    }

    openInventory(inventoryId: string) {
        
        window.open(`inventories/${inventoryId}`);
    }

    openItem(itemId: string) {
        window.open(`items/${itemId}`);
    }



    more() {
        let buttons = []; 
        buttons.push({
            color: "blue",
            title: `新增${this.inventory.value}的內容物`,
            action: InventoriesListTempleteActions.newInventory,
            params: {
                positionTarget: { ...this.inventory },
            }
        });
        buttons.push({
            color: "blue",
            title: `提領`,
            action: InventoriesListTempleteActions.pickup,
            params: {
                inventory: { ...this.inventory },
            }
        });
        buttons.push({
            color: "blue",
            title: `大量新增${this.inventory.value}的內容物`,
            action: InventoriesListTempleteActions.importList
        });
        buttons.push({
            color: "blue",
            title: `列印${this.inventory.value}的所有內容物`,
            action: InventoryViewPageActions.printInventories,
            params: {
                inventory: { ...this.inventory }
            }
        });
        buttons.push({
            color: "blue",
            title: `匯出目前查詢結果`,
            action: InventoriesListTempleteActions.exportList
        });
        buttons.push({
            color: "blue",
            title: "編輯",
            action: InventoriesListTempleteActions.editInventory,
            params: {
                inventory: { ...this.inventory }
            }
        });
        buttons.push({
            color: "red",
            title: "刪除",
            action: InventoryViewPageActions.remove,
            params: {
                inventory: { ...this.inventory }
            }
        });
        this.inventoryStore$.dispatch(InventoryViewPageActions.more({ buttons }));
    }

    ngOnInit() {
        this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store$.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "首頁";
        this.appService.bottom$.next(bottom);

        

        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            this.inventory = await this.findInventory();
            this.attributesService.selectByInventory(this.inventory.id).toPromise().then(async (attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }[]) => {
                this.attributes = attributes;
                await this.setAttributes();
            });
            this.appService.inventory$.next(this.inventory);
            this.inventory$.next(this.inventory);
            this.appService.item$.next(this.inventory.item);
            if (this.appService.action$.getValue() !== "提領內容物") this.appService.action$.next("預覽");
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (this.appService.module === "inventories") {
                    this.action = action;
                    let bottom = this.appService.bottom$.getValue() || {};
                    this.appService.presentation$.next(null);
                    switch (this.action) {
                        case "預覽":
                            this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                            this.store$.dispatch(LayoutActions.setTopTitle({ title: this.inventory.no }));
                            this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
                            bottom.type = "nav";
                            bottom.active = bottom.active || "首頁";
                            this.appService.bottom$.next(bottom);
                            break;
                        case "提領內容物(InventoryViewPageActions)":
                            this.store$.dispatch(LayoutActions.setTopLeft({ left: "預覽" }));
                            this.store$.dispatch(LayoutActions.setTopTitle({ title: "提領內容物" }));
                            this.store$.dispatch(LayoutActions.setTopRight({ right: "篩選" }));
                            bottom.type = "action";
                            bottom.action = this.action;
                            this.appService.bottom$.next(bottom);
                            break;
                        case "編輯(InventoryViewPageActions)":
                            this.appService.action$.next("預覽");
                            this.router.navigate([`inventories/${this.appService.id}/edit`]);
                            break;
                        case "直接提領(InventoryViewPageActions)":
                            this.appService.presentation$.next({ inventory: this.inventory, action: "直接提領(detail)" });
                            break;
                        case "確認提領內容物(InventoryViewPageActions)":
                            this.router.navigate([`./inventories/${this.activatedRoute.snapshot.params["id"]}/pickup`]);
                            break;
                        case "新增存量(InventoryViewPageActions)":
                            this.appService.inventory$.next(this.inventory$.getValue());
                            this.appService.item$.next(null);
                            let newInventory = new Inventory();
                            newInventory.position.targetId = this.inventory$.getValue().id;
                            newInventory.createdById = this.appService.profile.id;
                            this.inventoriesService.create(newInventory).toPromise().then((createdInventory: Inventory) => {
                                this.appService.action$.next("預覽");
                                this.router.navigate([`inventories/${createdInventory.id}/edit`]);
                                this.appService.presentation$.next(null);
                            });
                            break;
                        case "匯出目前查詢結果(InventoryViewPageActions)":
                            this.appService.presentation$.next(null);
                            break;
                        case "列印目前查詢結果(InventoryViewPageActions)":
                            this.appService.presentation$.next(null);
                            window.open(`print/inventories?inventoryId=${this.appService.id}`);
                            break;
                        case "大量新增(InventoryViewPageActions)":
                            this.appService.inventory$.next(this.inventory$.getValue());
                            this.appService.presentation$.next(null);
                            this.hiddenUpload.nativeElement.click();
                            break;
                        default:
                            break;
                    }
                }
            });

            this.ngOnInitSubscription = this.inventoryStore$.pipe(select(inventoryReducers.inventoryViewPage_upsertId)).subscribe((upsertId: string) => {

                if (upsertId !== "" && upsertId === this.inventory.id) {
                    if (this.inventorySubscription) this.inventorySubscription.unsubscribe();
                    this.inventorySubscription = this.inventoryStore$.pipe(
                        select(inventoryReducers.inventoryEntities_inventory(), {
                            id: upsertId
                        })
                    ).subscribe((inventory) => {
                        console.log("upsertId: " + upsertId, inventory);
                        if (inventory) {

                            this.inventory = { ...inventory };
                            let photo = this.inventory.photo;
                          //  this.inventory.photo = "converting";

                            

                            this.attributesService.selectByInventory(this.inventory.id).toPromise().then(async (attributes: { id: string; value: string; targetId: string; targetValue: string; level: number; valueType: string; itemIds:string; categoryIds: string; inventoryIds: string }[]) => {
                                this.attributes = attributes;
                                await this.setAttributes();
                            });



                            setTimeout(() => {
                                this.inventory.photo = photo;
                               // this.mode = "inventoriesList";
                                this.store$.dispatch(LayoutActions.setTopTitle({ title: `${this.inventory.no}` }));
                                this.loading = false;
                            }, 1);
                        }
                    });
                }
            });
        });

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            if (presentation && presentation.inventory) {
                let inventory: Inventory = presentation.inventory;
                let position = new Position();
                position.targetId = this.appService.profile.id;
                if (presentation.action === "全部提領(detail)" || inventory._take === inventory.value) {
                    position.ownerId = presentation.inventory.id;
                    this.positionsService.create(position).subscribe(async (position: Position) => {
                        this.appService.presentation$.next(null);
                        this.appService.action$.next("載具刷新");
                        this.appService.action$.next("預覽");
                        this.inventory = await this.findInventory();
                        this.appService.message$.next(`已移動${inventory.no}至您的載具中!`);
                    });
                } else {
                    if (presentation.action === "提領(detail)") { //提領
                        let newInventory = new Inventory();
                        newInventory.itemId = inventory.itemId;
                        newInventory.value = inventory._take;
                        this.segmentationsService.count({ ownerId: inventory.id }, false).subscribe((count: number) => {
                            newInventory.no = inventory.no.split("_")[0] + "_" + Gen.newNo();
                            this.inventoriesService.create(newInventory).subscribe((createdInventory: Inventory) => {
                                let segmentation = new Segmentation(inventory.id, newInventory.id);
                                segmentation.quantity = newInventory.value;
                                position.ownerId = createdInventory.id;
                                position.owner = null;
                                let promises = new Array<Promise<any>>();
                                promises.push(this.positionsService.create(position).toPromise());
                                promises.push(this.segmentationsService.create(segmentation).toPromise());
                                Promise.all(promises).then(async () => {
                                    this.appService.presentation$.next(null);
                                    this.appService.action$.next("載具刷新");
                                    this.appService.action$.next("預覽");
                                    this.inventory = await this.findInventory();
                                    inventory.itemValue = inventory.itemValue || "不明品項";
                                    this.appService.message$.next(`已提領${inventory.no}內${inventory._take}單位的${inventory.itemValue}單位至您的載具中!`);
                                });
                            });
                        });
                    }
                }
            }
            else {
                switch (presentation) {
                    case "取消":
                        this.appService.presentation$.next(null);
                        this.appService.action$.next("預覽");
                        break;
                    default:
                        break;
                }
            }
        });
    }

    async setAttributes() {

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
                        let inventory = await this.inventoriesService.find(this.attributes[i].value).toPromise();
                        this.attributes[i]["inventoryValue"] = inventory.no;
                        break;
                    case "細節":
                        break;
                    case "關聯":
                        break;
                    case "屬性":
                        break;
                    case "品項":
                        let item = await this.itemsService.find(this.attributes[i].value).toPromise();
                        this.attributes[i]["itemValue"] = item.value;
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
    }

    inputdata = [];
    uploadExcel(evt: any) {
        this.store$.dispatch(PresentationActions.message({ message: { h3: "上傳中", div: "存量上傳中, 請稍後..." } }));
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.inputdata = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

            let inventoryId = this.appService.inventory$.getValue().id;
            let promises = new Array<Promise<number>>();
            for (let i = 1; i < this.inputdata.length; i++) {
                let newInventory = new Inventory();
                newInventory.no = this.inputdata[i][0] || "";
                newInventory.value = this.inputdata[i][1] || 0;
                newInventory.position.targetId = inventoryId;
                newInventory.createdById = this.appService.profile.id;
                if (newInventory.no !== "" && newInventory.value.toString() !== "") {
                    promises.push(
                        new Promise<number>((resolve) => this.inventoriesService.create(newInventory).toPromise().then(() => resolve(1), () => {
                            alert(`${newInventory.no}上傳失敗`);
                            resolve(0);
                        }))
                    );
                }
            }

            Promise.all(promises).then(successCount => {
                let successCounts: number = 0;
                successCounts = successCount.reduce((a, b) => a + b);
                this.appService.presentation$.next(null);
                this.appService.message$.next(`上傳 ${successCounts} 筆存量成功!`);
                this.appService.action$.next("刷新");
            });

            evt.target.value = "" // 清空
        };
        reader.readAsBinaryString(target.files[0]);

    }

    findInventory(): Promise<Inventory> {
        this.inventory = null;
        if (this.inventorySubscription) this.inventorySubscription.unsubscribe();
        return new Promise((resolve) => {
            this.inventorySubscription = this.inventoriesService.find(this.appService.id).subscribe((inventory: Inventory) => {
                if (!inventory) this.router.navigate([`notFound`]);
                inventory._take = 0;
                this.loading = false;
                resolve(inventory);
            });
        });
    }

    private canvasRenderingContext2D: CanvasRenderingContext2D;
    canvasCount: number = 0;
    private canvas: ElementRef;
    private draw(lineWidth: number) {
        this.canvasCount++;
        if (this.canvasCount > 30) this.canvasCount++;
        if (this.canvasCount > 60) this.canvasCount++;
        if (this.canvasCount > 90) this.canvasCount++;
        if (this.canvasCount > 120) this.canvasCount++;
        if (this.canvasCount > 150) this.canvasCount++;
        if (this.canvasCount > 180) this.canvasCount--;
        if (this.canvasCount > 240) this.canvasCount--;
        if (this.canvasCount > 270) this.canvasCount--;
        if (this.canvasCount > 300) this.canvasCount--;
        if (this.canvasCount < 380) {
            this.canvasRenderingContext2D.beginPath();
            this.canvasRenderingContext2D.arc(136.5, 136.5, 109.2, Math.PI / 180 * 270, Math.PI / 180 * (this.canvasCount + 270));
            this.canvasRenderingContext2D.strokeStyle = "#ED4956";
            this.canvasRenderingContext2D.lineWidth = lineWidth;
            this.canvasRenderingContext2D.stroke();
        }
    }
    @ViewChild("canvas") set content(content: ElementRef) {
        if (content) {
            this.canvas = content;
            this.canvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
            let lineWidth = 2;
            if (this.appService.mobile) lineWidth = 6;
            setInterval(() => {
                this.draw(lineWidth);
            }, 1);
        }
    }
}
