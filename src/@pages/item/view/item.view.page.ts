import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "@services/app.service";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { ItemCategoriesService } from "@services/itemCategories.service";
import { ItemsService } from "@services/items.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Location } from "@angular/common";
import { Inventory, Position } from "@entities/inventory";
import { InventoriesService } from "@services/inventories.service";
import * as XLSX from "xlsx";
import * as itemReducers from "@reducers/item";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
import { map, tap } from "rxjs/operators";
import { ItemViewPageActions, ItemsListTempleteActions } from "@actions/item";
import { PresentationActions } from "@actions";
import { InventoriesListTempleteActions } from "@actions/inventory";
import { Item } from "@entities/item";
@Component({
    selector: "itemViewPage",
    templateUrl: "item.view.page.html",
    styleUrls: ["item.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class ItemViewPage implements OnInit {
    item: Item;
    ngOnInitSubscription: Subscription;
    actionsSubscription: Subscription;
    itemSubscription: Subscription;
    inventoriesSubscription: Subscription;
    attributeEditTempletes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    action: string;
    activatedRouteSubscription: Subscription;
    actionSubscription: Subscription;
    itemToggleStatusSubscription: Subscription;
    itemDeleteSubscription: Subscription;
    module: any;
    loading: boolean;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    mode: string;
    loading$: Observable<boolean>;
    searchState$: Observable<any>;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public itemsService: ItemsService,
        public activatedRoute: ActivatedRoute,
        public folderFilesService: FolderFilesService,
        public itemCategoriesService: ItemCategoriesService,
        public store$: Store<reducers.State>,
        public itemStore$: Store<itemReducers.State>,
        public location: Location) {}

    ngOnInit() {
        this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store$.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "首頁";
        this.appService.bottom$.next(bottom);
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.loading = true;
            this.itemStore$.dispatch(ItemViewPageActions.find({ id: paramMap.get("id") }));
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
            this.ngOnInitSubscription = this.itemStore$.pipe(select(itemReducers.itemViewPage_upsertId)).subscribe((upsertId: string) => {
    
                if (upsertId !== "") {
                    if (this.itemSubscription) this.itemSubscription.unsubscribe();
                    this.itemSubscription = this.itemStore$.pipe(
                        select(itemReducers.itemEntities_item(), {
                            id: upsertId
                        })
                    ).subscribe((item: Item) => {
                        console.log("upsertId: " + upsertId, item);
                        if (item) {

                            this.item = { ...item };
                            let photo = this.item.photo;
                            this.item.photo = "converting"; 


                            setTimeout(() => {
                                this.item.photo = photo;
                                this.mode = "inventoriesList";
                                this.store$.dispatch(LayoutActions.setTopTitle({ title: `${this.item.value}` }));
                                this.loading = false;
                            }, 1);
                        }
                    });
                }
            });
        });
    }
    ngOnDestroy() {
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
        if (this.itemDeleteSubscription) this.itemDeleteSubscription.unsubscribe();
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.itemToggleStatusSubscription) this.itemToggleStatusSubscription.unsubscribe();
        if (this.itemSubscription) this.itemSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    more() {
        let buttons = new Array<any>();
        let position = new Position();
        position.target = { ...this.appService.profile };
        position.targetId = position.target.id;


        buttons = [
            {
                color: "blue",
                title: "編輯",
                action: ItemViewPageActions.editItem,
                params: {
                    item: { ...this.item }
                }
            },
            {
                color: "blue",
                title: "新增配方",
                action: ItemViewPageActions.createRecipe,
                params: { item: this.item }
            },
            {
                color: "red",
                title: "刪除",
                action: ItemViewPageActions.remove,
                params: {
                    item: { ...this.item }
                }
            },
            {
                color: "blue",
                title: `新增${this.item.value}的存量`,
                action: InventoriesListTempleteActions.newInventory,
                params: {
                    item: { ...this.item }
                }
            },
            {
                color: "blue",
                title: `大量新增${this.item.value}的存量`,
                action: InventoriesListTempleteActions.importList
            },
            {
                color: "blue",
                title: `列印${this.item.value}的所有存量`,
                action: ItemViewPageActions.printInventories,
                params: {
                    item: { ...this.item }
                }
            },
            {
                color: "blue",
                title: `匯出目前查詢結果`,
                action: InventoriesListTempleteActions.exportList
            }
        ];
 
        this.itemStore$.dispatch(ItemViewPageActions.more({ buttons }));
    }

    setMode(mode: string) {
        this.mode = mode;
    }



    nextAction(action: string) {

        this.appService.action$.next(action);
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

            let itemId = this.appService.item$.getValue().id;
            let promises = new Array<Promise<number>>();
            for (let i = 1; i < this.inputdata.length; i++) {
                let newInventory = new Inventory();
                newInventory.no = this.inputdata[i][0];
                newInventory.value = this.inputdata[i][1];
                newInventory.itemId = itemId;
                newInventory.createdById = this.appService.profile.id;
                newInventory.position.targetId = this.appService.profile.id;
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
