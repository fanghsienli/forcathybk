import { Component, OnInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Position, Inventory, Segmentation } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { Gen } from "@entities/entity";
import { InventoriesListTempleteActions } from "@actions/inventory";
import { Store, select } from "@ngrx/store";
import * as inventoryReducers from "@reducers/inventory";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { Attribute } from "@entities/attribute";
import { PresentationActions } from "@actions";
import Swal from 'sweetalert2';

@Component({
    selector: "inventoriesListTemplete",
    templateUrl: "inventories.list.templete.html",
    styleUrls: ["inventories.list.templete.css"],
    host: { "class": "table-container" }
})
export class InventoriesListTemplete implements OnInit {
    hoverId: string;
    action: string;
    upsertIdSubscription: Subscription;
    actionSubscription: Subscription;
    inventoriesSubscription: Subscription;
    @ViewChild("exportTable") exportTable: ElementRef;
    activatedRouteSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    loading$: Observable<boolean>;
    checkedAttributes$: Observable<Attribute[]>;
    maxPage: number = 1;
    orderBy: string ="positionStartDate";
    descending: boolean=true;
    loading: boolean;
    pageIndex: number = 0;
    pageSize: number = 15;
    inventories: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedInventory: Inventory;
    presentationSubscription: Subscription;
    left: number = 0;
    itemId: string;
    inventoryId: string;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    constructor(

        private router: Router,
        public activatedRoute: ActivatedRoute,
        public inventoriesService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private inventoryStore$: Store<inventoryReducers.State>,
        private attributeStore$: Store<attributeReducers.State>, private element: ElementRef) {
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.inventoryStore$.select(inventoryReducers.inventoriesListTemplete_total);
        this.checkedAttributes$ = this.attributeStore$.select(attributeReducers.attributesCheckboxTemplete_checkedAttributes());
        this.inventories = new Array<Inventory>();
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.anyLike = anyLike;
            this.inventoryStore$.dispatch(InventoriesListTempleteActions.setFilter({ anyLike, itemId:this.itemId }));
            this.reLoad(1);
        });

        //當品項改變時
        this.ngOnInitSubscription.add(
            this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTemplete_itemId)).subscribe((itemId: string) => {
                this.itemId = itemId;
                this.reLoad(1);
            })
        );

        //當位置改變時
        this.ngOnInitSubscription.add(
            this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTemplete_inventoryId)).subscribe((inventoryId: string) => {
                if (inventoryId) this.inventoryId = inventoryId;
                else this.inventoryId = this.appService.profile.id;
                this.reLoad(1);
            })
        );

        //當增修時
        this.ngOnInitSubscription.add(
            this.inventoryStore$.pipe(
                select(inventoryReducers.inventoriesListTemplete_upsertId),
                filter((upsertId: string) => upsertId !== null)).subscribe((upsertId: string) => {
                    if (this.appService.id !== upsertId) {
                        if (this.upsertIdSubscription) this.upsertIdSubscription.unsubscribe();
                        this.upsertIdSubscription = this.inventoryStore$.pipe(
                            select(inventoryReducers.inventoryEntities_inventory(), {
                                id: upsertId
                            })
                        ).subscribe(async (inventory: Inventory) => {
                            this.inventoriesService.findDetails(inventory.id).toPromise().then((details: Inventory) => {
                                if (inventory) {
                                    for (let i = 0; i < this.inventories.length; i++) {
                                        if (this.inventories[i].id === inventory.id) {
                                            this.inventories[i] = { ...this.inventories[i], ...inventory, ...details };
                                        }
                                    }
                                    if (!this.inventories.find(x => x.id === inventory.id)) { 
                                        if (inventory.value > 0) {
                                            if (this.mergeIds.find(mergeId => mergeId === inventory.id)) this.inventories.push({ ...inventory, ...{ _merge: true } });
                                            else this.inventories.push({ ...inventory, ...{ _merge: false } });
                                        }
                                    }
                                }
                            });
                        });
                    }
                })
        );

        //當刪除時
        this.ngOnInitSubscription.add(
            this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTemplete_removeId)).subscribe((removedId: string) => {
                if (this.inventories.find(x => x.id === removedId)) this.resultCount--;
                this.inventories = this.inventories.filter(x => x.id !== removedId);
            })
        );

        //當匯出時
        this.ngOnInitSubscription.add(this.inventoryStore$.pipe(
            select(inventoryReducers.inventoriesListTemplete_exported),
            filter((exported: boolean) => exported === false)
        ).subscribe(() => {
            this.inventoryStore$.dispatch(PresentationActions.message({ message: { h3: "匯出中", div: "匯出存量中, 請稍後..." } }));
            setTimeout(() => this.exportExcel(), 500);
        }));

        //當匯入時
        this.ngOnInitSubscription.add(this.inventoryStore$.pipe(
            select(inventoryReducers.inventoriesListTemplete_imported),
            filter((imported: boolean) => imported === false)
        ).subscribe(() => {
            this.hiddenUpload.nativeElement.click();

        }));

        //當刪除時
        this.ngOnInitSubscription.add(
            this.inventoryStore$.pipe(select(inventoryReducers.inventoriesListTemplete_removeId)).subscribe((removedId: string) => {
                if (this.inventories.find(x => x.id === removedId)) this.resultCount--;
                this.inventories = this.inventories.filter(x => x.id !== removedId);
            })
        );

        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (action && this.action !== action) {
                    this.action = action;
                    switch (this.action) {
                        case "匯出":
                            this.exportExcel();
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {            
            if (presentation && presentation.inventory) {
                let inventory: Inventory = presentation.inventory;
                let position = new Position();
                position.targetId = this.appService.profile.id;
                if (presentation.action === "全部提領(list)" || inventory._take === inventory.value) {

                    this.inventoryStore$.dispatch(PresentationActions.message({ message: { h3: "提領中", div: `提領 ${inventory._take} 單位的『${inventory.itemValue}』中, 請稍後...` } }));
                    position.ownerId = presentation.inventory.id;
                    this.positionsService.create(position).subscribe(async (position: Position) => {
                        this.appService.presentation$.next(null);
                        this.inventoryStore$.dispatch(InventoriesListTempleteActions.setSort({
                            orderBy: this.orderBy,
                            descending: this.descending
                        }));
                        this.reLoad(1);
                        inventory.itemValue = inventory.itemValue || "不明品項";
                        this.inventoryStore$.dispatch(PresentationActions.close({ message: `已提領『${inventory.no}』內 ${inventory._take} 單位的『${inventory.itemValue}』至您的載具中!` }));
                    });
                } else {
                    if (presentation.action === "提領(list)") { //提領 
                        this.inventoryStore$.dispatch(PresentationActions.message({ message: { h3: "提領中", div: `提領 ${inventory._take} 單位的『${inventory.itemValue}』中, 請稍後...` } }));
                        let newInventory = new Inventory();
                        newInventory.itemId = inventory.itemId;
                        newInventory.value = inventory._take;
                        this.segmentationsService.count({ ownerId: inventory.id }, false).subscribe((count: number) => {
                            newInventory.no = `${inventory.no.split("_")[0]}_${Gen.newNo()}`;
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
                                    this.inventoryStore$.dispatch(InventoriesListTempleteActions.setSort({
                                        orderBy: this.orderBy,
                                        descending: this.descending
                                    }));
                                    this.reLoad(1);
                                    inventory.itemValue = inventory.itemValue || "不明品項";
                                    this.inventoryStore$.dispatch(PresentationActions.close({ message: `已提領『${inventory.no}』內 ${inventory._take} 單位的『${inventory.itemValue}』至您的載具中!` }));
                                });
                            });
                        });
                    }
                }
            }
            else {
                switch (presentation) {
                    case "取消":
                        this.inventoryStore$.dispatch(PresentationActions.close({ message: "" }));
                        this.appService.action$.next("預覽");
                        break;
                    default:
                        break;
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.upsertIdSubscription) this.upsertIdSubscription.unsubscribe();
    }






    mergeIds: string[] = [];
    toggleMerge(inventory) { 
        inventory._merge = inventory._merge ? false : true;
        if (inventory._merge) {
            this.mergeIds.push(inventory.id);
            if (this.inventories.filter(x => x._merge).length === 1) {
                console.log("itemId: '" + inventory.itemId + "'");
                this.inventoryStore$.dispatch(InventoriesListTempleteActions.setFilter({ anyLike: this.anyLike, itemId: inventory.itemId }));
            }
        } else {
            this.mergeIds = this.mergeIds.filter(x => x !== inventory.id);
            if (this.inventories.filter(x => x._merge).length === 0) {
                console.log("itemId: ''");
                this.inventoryStore$.dispatch(InventoriesListTempleteActions.setFilter({ anyLike: this.anyLike, itemId: "" }));
            }
        }
    }

    mergePromise(no) {
        return this.inventoriesService.createMerge({ no, sourceIds: this.mergeIds }).toPromise();
    }

    merge() {
        Swal.fire({
            title: '輸入合併後編號',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonText: '合併',
            showLoaderOnConfirm: true,
            preConfirm: (no) => this.mergePromise(no),
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                 
                let mergedInventory = result.value as Inventory;
                mergedInventory._merge = true;
                this.inventories.push(mergedInventory);

                this.inventories = this.inventories.filter(x => !this.mergeIds.find(mergeId => mergeId === x.id));

                Swal.fire({ 
                    icon: 'success',
                    title: '合併成功',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    @HostListener('scroll', ['$event']) // for window scroll events
    onScroll(event) {

    }

    typeOf(any: any) {
        if (typeof any === "object") return Object.prototype.toString.call(any);
        return typeof any;
    }

    openInventory(inventoryId: string) {
        window.open(`inventories/${inventoryId}`);
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) this.descending = this.descending ? false : true;
        else {
            this.orderBy = orderBy;
            this.descending = true;
        }
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.setSort({
            orderBy: this.orderBy,
            descending: this.descending
        }));
        this.reLoad(1);
    }
    showScrollToLeft() {
        if (this.exportTable) {
            if (this.element.nativeElement.scrollLeft === 0) return false;
            return this.exportTable.nativeElement.clientWidth > this.element.nativeElement.clientWidth;
        } else return false;
    }
    showScrollToRight() {
        if (this.exportTable) {
            if (this.element.nativeElement.scrollLeft === (this.exportTable.nativeElement.clientWidth - this.element.nativeElement.clientWidth)) return false;
            return this.exportTable.nativeElement.clientWidth > this.element.nativeElement.clientWidth;
        } else return false;
    }
    scrollRight() {
        // console.log(this.exportTable.nativeElement.clientWidth, this.element.nativeElement.clientWidth+this.left);
        if (this.element) {
            let left = this.element.nativeElement.scrollLeft + 150;
            this.element.nativeElement.scrollTo({ left: left, behavior: 'smooth' });
        }
    }
    scrollLeft() {
        // console.log(this.exportTable.nativeElement.clientWidth, this.element.nativeElement.clientWidth+this.left);
        if (this.element) {
            let left = this.element.nativeElement.scrollLeft - 150;
            this.element.nativeElement.scrollTo({ left: left, behavior: 'smooth' });
        }
    }


    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.exportListOk());
    }
    importExcel(evt: any) {
        this.inventoryStore$.dispatch(PresentationActions.message({ message: { h3: "匯入中", div: "匯入存量中, 請稍後..." } }));
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
            let inputdata = (XLSX.utils.sheet_to_json(ws, { header: 1 }));


            let promises = new Array<Promise<number>>();
            for (let i = 1; i < inputdata.length; i++) {
                let newInventory = new Inventory();
                newInventory.no = inputdata[i][0];
                newInventory.value = inputdata[i][1];
                newInventory.itemId = this.itemId;
                newInventory.createdById = this.appService.profile.id;
                newInventory.position.targetId = this.inventoryId;
                if (newInventory.no !== "" && newInventory.value.toString() !== "") {
                    promises.push(
                        new Promise<number>((resolve) => this.inventoriesService.create(newInventory).toPromise().then((inventory: Inventory) => {
                            this.inventoryStore$.dispatch(InventoriesListTempleteActions.createSuccess({ inventory }));
                            resolve(1);
                        }, () => {
                            alert(`${newInventory.no}上傳失敗`);
                            resolve(0);
                        }))
                    );
                }
            }

            Promise.all(promises).then(successCount => {
                let successCounts: number = 0;
                successCounts = successCount.reduce((a, b) => a + b);
                this.inventoryStore$.dispatch(PresentationActions.close({ message: `匯入 ${successCounts} 筆存量成功!` }));
            });

            evt.target.value = "" // 清空
        };
        reader.readAsBinaryString(target.files[0]);

    }


    goToInventory(inventoryId: string) {
        this.router.navigate([`inventories/${inventoryId}`]);
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    editInventory(inventory: Inventory) {
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.editInventory({ inventory}));
    }

    filterInventories(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getInventories(): Promise<Inventory[]> {
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.inventoriesSubscription = this.inventoryStore$.pipe(
                select(inventoryReducers.inventoriesListTemplete_inventories(), {
                    pageIndex: this.pageIndex,
                    descending: this.descending
                })).subscribe(result => {
                    if (result.loaded) {
                        this.resultCount = result.count;
                        this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                        resolve(result.inventories);
                    }
                });
        });
    }



    delete(inventory: Inventory) {
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.remove({ inventory }));
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.inventoryStore$.dispatch(InventoriesListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.inventories = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreInventories = await this.getInventories();
        if (moreInventories.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreInventories.forEach(inventory => {
                if (this.inventories.find(x => x.id === inventory.id)) this.inventories = this.inventories.filter(x => x.id !== inventory.id);
                if (inventory.value > 0) {
                    if (this.mergeIds.find(mergeId => mergeId === inventory.id)) this.inventories.push({ ...inventory, ...{ _merge: true } });
                    else this.inventories.push({ ...inventory, ...{ _merge: false } });
                }
            });

            if (this.inventories.length - moreInventories.length >= 0) {
                for (let i = (this.inventories.length - moreInventories.length); i < this.inventories.length; i++) {
                    this.inventoriesService.findDetails(this.inventories[i].id).toPromise().then((details: Inventory) => {
                        let inventory = {
                            ...this.inventories[i], ...details
                        };
                        if (this.inventories[i]) {
                            if (this.inventories[i].id === inventory.id) {
                                this.inventories[i] = inventory;
                            }
                        }
                    });
                }
            }
            window.scrollTo({ top: pageYOffset });
            setTimeout(() => this.loading = false, debounceTime);
        } else {
            setTimeout(() => this.loading = false, debounceTime);
        }
    }

    more(inventory: Inventory) {
        this.selectedInventory = { ...inventory };
        this.selectedInventory._take = 0;
        this.hoverId = this.selectedInventory.id;
        let buttons = [
            {
                color: "blue",
                title: "提領",
                action: InventoriesListTempleteActions.pickup,
                params: {
                    inventory: this.selectedInventory,
                    presentationAction: "直接提領(list)"
                }
            },
            {
                color: "blue",
                title: "編輯",
                action: InventoriesListTempleteActions.editInventory,
                params: {
                    inventory: { ...this.selectedInventory }
                }
            },
            {
                color: "red",
                title: "刪除",
                action: InventoriesListTempleteActions.remove,
                params: {
                    inventory: { ...this.selectedInventory }
                }
            }
        ];


        this.inventoryStore$.dispatch(InventoriesListTempleteActions.more({ buttons }));
    }


    pickup(inventory) {
        this.appService.presentation$.next({ inventory: inventory, action: "直接提領(list)" });
        this.inventoryStore$.dispatch(InventoriesListTempleteActions.pickup({ inventory, presentationAction: "直接提領(list)" }));
    }
}