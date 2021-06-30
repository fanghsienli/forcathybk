import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { AppService } from "@services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
import * as workOrderReducers from "@reducers/workOrder";
import * as PresentationActions from "@actions/presentation.actions";
import { Inventory, InventoryAttribute } from "@entities/inventory";
import { Item } from "@entities/item";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss';
import { InventoriesService } from "@services/inventories.service";
import { InventoryAttributesService } from "@services/inventoryAttributes.service";
import { BrowserQRCodeReader, Result } from "@zxing/library";
@Component({
    selector: "presentation",
    templateUrl: "presentation.component.html",
    styleUrls: ["presentation.component.css"]
})
export class PresentationComponent implements OnInit {
    buttons$: Observable<any[]>;
    width$: Observable<string>;
    type$: Observable<string>;
    title$: Observable<string>;
    item$: Observable<any>;
    station$: Observable<any>;
    item: Item;
    target: any;
    limit$: Observable<number>;
    limit: number;
    message$: Observable<any>;
    inventory: Inventory;
    invoice: any;
    presentation: any;
    stationSubscription: Subscription;
    titleSubscription: Subscription;
    itemSubscription: Subscription;
    limitSubscription: Subscription;
    presentationSubscription: Subscription;
    temp: string;
    beforeIsControl: boolean;
    upValue: number;
    upValue2: number;
    usedPower: number;
    mode: string;
    workOrder$: Observable<any>;
    workOrder: Inventory;
    workOrderSubscription: Subscription;
    qrcodeString: string;
    memo: string;
    passedValue: number;
    defects: any[];
    reasons: any[];
    title: string;
    constructor( 
        public location: Location,
        public router: Router,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public store$: Store<reducers.State>,
        public workOrderStore$: Store<workOrderReducers.State>,
        public inventoryAttributesService: InventoryAttributesService,
        public appService: AppService
    ) {
        this.screenWidth = screen.width - 42;
        this.width$ = store$.pipe(select(reducers.presentation_width));
        this.message$ = store$.pipe(select(reducers.presentation_message));
        this.buttons$ = store$.pipe(select(reducers.presentation_buttons));
        this.type$ = store$.pipe(select(reducers.presentation_type));
        this.title$ = store$.pipe(select(reducers.presentation_title));
        this.item$ = store$.pipe(select(reducers.presentation_item));
        this.station$ = store$.pipe(select(reducers.presentation_station));
        this.limit$ = store$.pipe(select(reducers.presentation_limit));
        this.workOrder$ = store$.pipe(select(reducers.presentation_workOrder));


    }
    codeReader: BrowserQRCodeReader;
    videoInputDevices: MediaDeviceInfo[];
    selectedVideoInputDevice: MediaDeviceInfo;
    invoices: any[];
    qrcodeReaderSubscription: Subscription;
    result: string;
    screenWidth: number;
    camera: ElementRef;
    @ViewChild("camera3") set content(content: ElementRef) {
        if (content) {
            this.camera = content;
            this.codeReader = new BrowserQRCodeReader();
            try {
                this.codeReader.listVideoInputDevices().then((videoInputDevices: MediaDeviceInfo[]) => {
                    this.videoInputDevices = videoInputDevices;
                    if (videoInputDevices.length > 1) this.selectedVideoInputDevice = this.videoInputDevices[videoInputDevices.length - 1];
                    else this.selectedVideoInputDevice = this.videoInputDevices[0];
                    this.scanNext(this.selectedVideoInputDevice.deviceId);
                }).catch(err => console.error(err));
            } catch (err) {
                console.error(err);
            }
        }
    }

    onClick(e) {
        console.log(e);
    }

    ngOnInit() {
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            if (presentation) {
                this.presentation = presentation;
                if (this.presentation.inventory) {

                    this.inventory = { ...this.presentation.inventory };
                    this.inventory._take = 0;
                }
                if (this.presentation.invoice) this.invoice = this.presentation.invoice;
            }
        });

        this.titleSubscription = this.title$.subscribe((title: string) => {
            this.title = title;
            switch (title) {
                case "startStation":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.stationSubscription) this.stationSubscription.unsubscribe();
                    this.stationSubscription = this.station$.subscribe((station: any) => {
                        this.target = station;
                    });
                    if (!this.reasons) {
                        this.reasons = new Array<{ value: string }>();
                        this.reasons.push({ 
                            value: ""
                        }); 
                    }
                    console.log(this.reasons);
                    break;
                case "pauseStation":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.stationSubscription) this.stationSubscription.unsubscribe();
                    this.stationSubscription = this.station$.subscribe((station: any) => {
                        this.target = station;

                    });
                    if (!this.reasons) {
                        this.reasons = new Array<{ value: string }>();
                        this.reasons.push({
                            value: ""
                        });
                    }
                    console.log(this.reasons);
                    break;
                case "resumeStation":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.stationSubscription) this.stationSubscription.unsubscribe();
                    this.stationSubscription = this.station$.subscribe((station: any) => {
                        this.target = station;

                    });
                    if (!this.reasons) {
                        this.reasons = new Array<{ value: string }>();
                        this.reasons.push({
                            value: ""
                        });
                    }
                    console.log(this.reasons);
                    break;
                case "stopStation":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.stationSubscription) this.stationSubscription.unsubscribe();
                    this.stationSubscription = this.station$.subscribe((station: any) => {
                        this.target = station;

                    });
                    if (!this.reasons) {
                        this.reasons = new Array<{ value: string }>();
                        this.reasons.push({
                            value: ""
                        });
                    }
                    console.log(this.reasons);
                    break;
                case "pickup":
                    this.mode = "upValue";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.itemSubscription) this.itemSubscription.unsubscribe();
                    this.itemSubscription = this.item$.subscribe((item: Item) => {
                        this.item = item;
                    });
                    if (this.limitSubscription) this.limitSubscription.unsubscribe();
                    this.limitSubscription = this.limit$.subscribe((limit: number) => {
                        this.limit = limit;
                    });
                    break;
                case "startup":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.itemSubscription) this.itemSubscription.unsubscribe();
                    this.itemSubscription = this.item$.subscribe((item: Item) => {
                        this.item = item;
                    });
                    if (this.limitSubscription) this.limitSubscription.unsubscribe();
                    this.limitSubscription = this.limit$.subscribe((limit: number) => {
                        this.limit = limit;
                    });
                    break;
                case "inspection":
                    this.mode = "";
                    if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
                    this.workOrderSubscription = this.workOrder$.subscribe((workOrder: Inventory) => {
                        this.workOrder = workOrder;
                    });
                    if (this.itemSubscription) this.itemSubscription.unsubscribe();
                    this.itemSubscription = this.item$.subscribe((item: Item) => {
                        this.item = item;
                    });
                    break;
                default:
                    break;
            }
        });
    }

    ngOnDestroy() {
        if (this.titleSubscription) this.titleSubscription.unsubscribe();
        if (this.itemSubscription) this.itemSubscription.unsubscribe();
        if (this.limitSubscription) this.limitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.workOrderSubscription) this.workOrderSubscription.unsubscribe();
        if (this.stationSubscription) this.stationSubscription.unsubscribe();
    }
    @ViewChild("invoiceId") invoiceId: ElementRef;
    upper() {
        this.invoiceId.nativeElement.value = this.invoiceId.nativeElement.value.toUpperCase();
    }

    isInvoiceError() {
        if (parseFloat(this.invoice.taxed.toString()) === 0) return true;
        if (this.invoice.buyer.length !== 8) return true;
        if (this.invoice.seller.length !== 8) return true;
        if (this.invoice.id.length !== 10) return true;
        if (this.invoice.date.length !== 7) return true;
        if (!(parseFloat(this.invoice.date.substr(0, 3)) > 107 && parseFloat(this.invoice.date.substr(0, 3)) < 127)) return true;
        if (!(parseFloat(this.invoice.date.substr(3, 2)) >= 1 && parseFloat(this.invoice.date.substr(3, 2)) <= 12)) return true;
        if (!(parseFloat(this.invoice.date.substr(5, 2)) >= 1 && parseFloat(this.invoice.date.substr(5, 2)) <= 31)) return true;
        return false;
    }
    validateEngNum(event: KeyboardEvent): void {
        let pattern = /^[A-Z0-9.]+$/g;
        if (this.invoiceId.nativeElement.value.length < 2) pattern = /^[A-Z]+$/g;
        else pattern = /^[0-9.]+$/g;
        let inputChar = String.fromCharCode(event.charCode).toUpperCase();
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    blur() {
        if (this.inventory) {
            if (this.inventory.value < this.inventory._take) this.inventory._take = this.inventory.value
        }
    }

    plus2() {
        if (this.upValue + 1 < this.limit) this.upValue++;
        else this.upValue = this.limit;
    }

    minus2() {
        if (this.upValue - 1 > 0) this.upValue--;
        else this.upValue = 0;
    }

    listenResult: any;

    pickupQrcode() {
        this.appService.workOrderEvent$.next(null);
        this.mode = "";
        let workOrderEvent = new Inventory();
        let workOrderEventId = workOrderEvent.id;
        this.qrcodeString = "pickup_" + this.upValue.toString() + "_" + this.workOrder.id + workOrderEventId + this.item.id + this.appService.profile.id;

        this.listenResult = setInterval(() => {
            this.inventoriesService.find(workOrderEventId).toPromise().then((workOrderEvent: Inventory) => {
                if (workOrderEvent) {
                    let inventoryAttribute = new InventoryAttribute();
                    inventoryAttribute.value = this.memo;
                    inventoryAttribute.ownerId = workOrderEventId;
                    inventoryAttribute.targetId = "f7432ea6-33e1-4a8c-b390-010e0091833e";
                    this.inventoryAttributesService.create(inventoryAttribute).toPromise().then(() => {
                        this.inventoriesService.findDetails(workOrderEventId).toPromise().then((workOrderEventDetails: Inventory) => {
                            workOrderEvent = {
                                ...workOrderEvent, ...workOrderEventDetails
                            };
                            this.cancelPickup();
                            Swal.fire(
                                '領料完成!',
                                `領取${this.item.value} ${this.upValue} 單位`,
                                'success'
                            );
                            this.appService.workOrderEvent$.next(workOrderEvent);
                            this.store$.dispatch(PresentationActions.close({ message: "" }));
                        });
                    });
                }
            });
        }, 2000);
    }

    keyup(upValue) {
        if (upValue > this.limit) this.upValue = this.limit;
        if (upValue < 0) this.upValue = 0;
    }

    startupValue() {
        if (this.upValue > this.limit) this.upValue = this.limit;
        if (this.upValue < 0) this.upValue = 0;

        this.inventoriesService.createStartup({
            itemId: this.item.id,
            targetId: this.target.id,
            workOrderId: this.workOrder.id,
            memo: this.memo,
            upValue: this.upValue
        }).toPromise().then((workOrderEvent: Inventory) => {
            if (workOrderEvent) {
                this.inventoriesService.findDetails(workOrderEvent.id).toPromise().then((workOrderEventDetails: Inventory) => {
                    workOrderEvent = {
                        ...workOrderEvent, ...workOrderEventDetails
                    };
                    Swal.fire(
                        '投產完成!',
                        `投料${this.item.value} ${this.upValue} 單位`,
                        'success'
                    );
                    this.appService.workOrderEvent$.next(workOrderEvent);
                    this.store$.dispatch(PresentationActions.close({ message: "" }));
                });
            }
        });
    }
    scanNext(deviceId: string) {
        this.codeReader.decodeFromInputVideoDevice(deviceId, this.camera.nativeElement).then(async (result: Result) => {
            this.target = await this.inventoriesService.find(result.getText().split("/")[1]).toPromise();
            if (this.target) {
                this.mode = "upValue";
                if (!this.defects) {
                    this.defects = new Array<{ attributeValue: string; value: number; disable: boolean }>();
                    this.defects.push({
                        attributeValue: "合格",
                        value: 0,
                        disable: true
                    });
                    this.defects.push({
                        attributeValue: "",
                        value: 0
                    });
                }
            }
        }).catch(err => console.error(err));
    }
    inspectionValue() {
        this.defects = this.defects.filter(x => x.attributeValue !== "" && x.value > 0);
        this.inventoriesService.createInspection({
            itemId: this.item.id,
            targetId: this.target.id,
            workOrderId: this.workOrder.id,
            upValue: this.upValue,
            memo: this.memo,
            defects: this.defects
        }).toPromise().then((workOrderEvent: Inventory) => {
            if (workOrderEvent) {
                this.inventoriesService.findDetails(workOrderEvent.id).toPromise().then((workOrderEventDetails: Inventory) => {
                    workOrderEvent = {
                        ...workOrderEvent, ...workOrderEventDetails
                    };
                    Swal.fire(
                        '填寫完畢!',
                        `產出${this.item.value} ${this.upValue} 單位`,
                        'success'
                    );
                    this.appService.workOrderEvent$.next(workOrderEvent);
                    this.store$.dispatch(PresentationActions.close({ message: "" }));
                });
            }
        });
    }
    stationValue() {
        this.reasons = this.reasons.filter(x => x.value !== "");
        let action = "";
        let swalString = "";
        switch (this.title) {
            case "startStation":
                action = "開始生產";
                swalString = "電表: " + this.usedPower + "度";
                break;
            case "pauseStation":
                action = "暫停生產";
                for (let reason of this.reasons) {
                    swalString = swalString + ", " + reason.value;
                }
                swalString = swalString.substr(1);
                break;
            case "resumeStation":
                action = "恢復生產";
                swalString = this.memo;
                break;
            case "stopStation":
                action = "中止生產";
                swalString = "電表: " + this.usedPower + "度";
                break;
            default:
                break;
        }
        

       


        this.inventoriesService.createStation({
            action: action,
            targetId: this.target.id,
            workOrderId: this.workOrder.id,
            upValue: this.upValue,
            usedPower: this.usedPower,
            memo: this.memo,
            reasons: this.reasons
        }).toPromise().then((workOrderEvent: Inventory) => {
            if (workOrderEvent) {
                this.inventoriesService.findDetails(workOrderEvent.id).toPromise().then((workOrderEventDetails: Inventory) => {
                    workOrderEvent = {
                        ...workOrderEvent, ...workOrderEventDetails
                    };
                    Swal.fire(
                        action+"!",
                        swalString,
                        'success'
                    );
                    this.appService.workOrderEvent$.next(workOrderEvent);
                    this.store$.dispatch(PresentationActions.close({ message: "" }));
                });
            }
        });
    }
    blurDefect() {
        this.defects = this.defects.filter(x => x.attributeValue !== "");
        this.defects.push({
            attributeValue: "",
            value: 0
        });
    }
    blurReason() {
        this.reasons = this.reasons.filter(x => x.value !== "");
        this.reasons.push({
            value: ""
        });
    }
    cancelPickup() {
        this.mode = "";
        clearTimeout(this.listenResult);
    }

    keydown(event): void {
        let pattern = "1234567890";
        let inputChar = event.key;
        if (event.target.selectionStart === 0 && event.target.selectionEnd === 0 &&
            (event.code === "Numpad0" || event.code === "Digit0") && this.inventory._take.toString().length > 0) {
            event.preventDefault();
        }
        if (event.target.selectionStart === 1 && event.target.selectionEnd === 1 &&
            (event.code === "Numpad0" || event.code === "Digit0") && this.inventory._take.toString().length > 0 && this.inventory._take.toString().substr(0, 1) === "0") {
            event.preventDefault();
        }
        if (event.key === "." && this.inventory._take.toString().indexOf(".") !== -1) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.beforeIsControl) {
            if (event.key !== "Backspace" &&
                event.key !== "Shift" &&
                event.key !== "." &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Delete" &&
                event.key !== "Control") {
                if (pattern.indexOf(inputChar) === -1) {
                    event.preventDefault();
                } else {

                    if (this.inventory) {
                        if (parseFloat(this.inventory._take.toString() + inputChar) > this.inventory.value) {
                            this.inventory._take = this.inventory.value;
                            event.preventDefault();
                        }
                    }
                }
            }
        }
        if (event.key === "Control") this.beforeIsControl = true;
        else this.beforeIsControl = false;
    }

    minus(inventory: Inventory) {
        let p: string = inventory._take.toString() === "" ? "0" : inventory._take.toString();
        inventory._take = (parseFloat(p) - 1) > 0 ? (parseFloat(p) - 1) : 0;

    }

    plus(inventory: Inventory) {
        let p: string = inventory._take.toString() === "" ? "0" : inventory._take.toString();
        inventory._take = (parseFloat(p) + 1) <= inventory.value ? (parseFloat(p) + 1) : inventory.value;
    }

    cancel() {
        this.store$.dispatch(PresentationActions.close({ message: "" }));
    }

    submitAction(action: any) {
        let input = this.temp;
        this.store$.dispatch(action(input));
    }

    nextAction(button: any) {
        //  this.store.dispatch(action());

        let title = button.title || button;
        switch (title) {
            case "提領(list)":
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "提領(detail)":
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "全部提領(list)":
                this.inventory._take = this.inventory.value;
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "全部提領(detail)":
                this.inventory._take = this.inventory.value;
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "放置":
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "全部放置":
                this.appService.presentation$.next({ inventory: this.inventory, action: title });
                break;
            case "新增發票":
                this.appService.presentation$.next({ invoice: this.invoice, action: title });
                break;
            case "取消":

                this.appService.presentation$.next(null);
                break;
            case "送出屬性":
                this.appService.presentation$.next(null);
                break;
            default:
                if (button.params) this.store$.dispatch(button.action(button.params));
                else this.store$.dispatch(button.action());
                break;
        }
    }
}
