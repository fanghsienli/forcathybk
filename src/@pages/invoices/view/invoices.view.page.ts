import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "@services/app.service";
import { Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { BrowserQRCodeReader, Result } from "@zxing/library";
import { InventoriesService } from "@services/inventories.service"; 
import * as LayoutActions from "@actions/layout.actions";
import { Store } from "@ngrx/store";
import * as reducers from "@reducers";
@Component({
    selector: "invoicesViewPage",
    templateUrl: "invoices.view.page.html",
    styleUrls: ["invoices.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class InvoicesViewPage implements OnInit {
    action: string;
    activatedRouteSubscription: Subscription;
    actionSubscription: Subscription;
    codeReader: BrowserQRCodeReader;
    videoInputDevices: MediaDeviceInfo[];
    selectedVideoInputDevice: MediaDeviceInfo;   
    invoices: any[];
    qrcodeReaderSubscription: Subscription;
    result: string;
    screenWidth: number;
    camera: ElementRef;   
    presentationSubscription: Subscription;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public store: Store<reducers.State>,
        public inventoriesService: InventoriesService,
        public folderFilesService: FolderFilesService
    ) {
        this.screenWidth = screen.width-32;
        this.invoices = new Array<any>();
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
    }
    remove(invoiceId: string) {
        this.invoices = this.invoices.filter(x => x.id !== invoiceId);
    }
    ngOnInit() { 
        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "發票建檔" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "上傳" })); 
        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "首頁";
        this.appService.bottom$.next(bottom);
        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = ""; 
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (this.appService.module === "home" && action) {
                    this.action = action;
                    switch (this.action) {
                        case "上傳":
                            
                            this.submit().then(() => {
                                this.appService.message$.next("發票上傳完成");
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            if (presentation && presentation.invoice && presentation.action==="新增發票") { 
                if (presentation.invoice.price === 0) presentation.invoice._error=true;
                this.invoices.push(presentation.invoice);
                this.appService.presentation$.next(null);
            }
        });
    }

    @ViewChild("camera") set content(content: ElementRef) {
        if (content) {
            this.camera = content; 
            this.codeReader = new BrowserQRCodeReader();
            try {
                this.codeReader.listVideoInputDevices().then((videoInputDevices: MediaDeviceInfo[]) => {
                    this.scanNext();
                }).catch(err => console.error(err));
            } catch (err) {
                console.error(err);
            }
        }
    }

    submit() {
        return new Promise((resolve) => {
            let promises = [];
            for (let invoice of this.invoices) {
                /*
                let inventorySave = new InventorySave();
                inventorySave.details = new Array<InventoryAttribute>();
                inventorySave.inventory = new Inventory();
                inventorySave.inventory.no = invoice.id;
                inventorySave.inventory.value = invoice.taxed;
                inventorySave.inventory.itemId = "5ebabc20-a7de-43e7-a195-3f10a5bd9e01";
                let invoiceDate = { value: invoice.date, ownerId: inventorySave.inventory.id, targetId: "430b0587-06d0-4ee3-99e2-9975a004708e" } as InventoryAttribute;
                inventorySave.details.push(invoiceDate);
                let invoicePrice = { value: invoice.price, ownerId: inventorySave.inventory.id, targetId: "fa270c69-fd3d-44ad-b979-db7102c20fe8" } as InventoryAttribute;
                inventorySave.details.push(invoicePrice);
                let invoiceTaxed = { value: invoice.taxed, ownerId: inventorySave.inventory.id, targetId: "b9ec68a7-fd36-49de-abb4-7c594d99fd31" } as InventoryAttribute;
                inventorySave.details.push(invoiceTaxed);
                let invoiceBuyer = { value: invoice.buyer, ownerId: inventorySave.inventory.id, targetId: "c3e35fa4-1f44-494f-8300-564acd18d49c" } as InventoryAttribute;
                inventorySave.details.push(invoiceBuyer);
                let invoiceSeller = { value: invoice.seller, ownerId: inventorySave.inventory.id, targetId: "b507be27-2eb8-4a6e-9ea2-aa7e6f9250fd" } as InventoryAttribute;
                inventorySave.details.push(invoiceSeller);

                promises.push(this.inventoriesService.createSave(inventorySave).toPromise()); 
                Promise.all(promises).then(async () => {
                    this.invoices = [];*/
                    resolve();
                //});
            }


            
        });
    }

    scanNext() {
        this.codeReader.decodeFromInputVideoDeviceContinuously(undefined, this.camera.nativeElement,
            (result: Result) => {
                if (result) { 
                    if (this.result !== result.getText()) {
                        this.result = result.getText();
                        if (this.result.length > 45 && !this.invoices.find(x => x.id === this.result.substr(0, 10)) && this.result.substr(0, 2) !== "**") {
                            let invoice = {
                                id: this.result.substr(0, 10),
                                date: this.result.substr(10, 7),
                                price: parseInt(this.result.substr(21, 8), 16),
                                taxed: parseInt(this.result.substr(29, 8), 16),
                                buyer: this.result.substr(37, 8),
                                seller: this.result.substr(45, 8),
                                error: (parseInt(this.result.substr(21, 8), 16) === 0 ? true : false)
                            };
                            this.invoices.push(invoice);
                        }
                    }
                }
            }).catch(err => console.error(err));
    }
}
