import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter, Result } from "@zxing/library";
import { Router } from "@angular/router";
import { AppService } from "@services/app.service";
import { Subscription, Observable } from "rxjs";
import * as LayoutActions from "@actions/layout.actions"; 
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
@Component({
    selector: "qrcodeReader",
    templateUrl: "qrcodeReader.component.html",
    styleUrls: ["qrcodeReader.component.css"],
    host: { "class": "qrcode" }
})
export class QrcodeReaderComponent implements OnInit {
    codeReader: BrowserQRCodeReader;
    screenWidth: number;
    videoInputDevices: MediaDeviceInfo[];
    selectedVideoInputDevice: MediaDeviceInfo;
    qrcodeReaderSubscription: Subscription;
    camera: ElementRef;
    topTitle$: Observable<string>;
    topRight$: Observable<string>;
    topLeft$: Observable<string>;
    topTitle: string;
    topRight: string;
    topLeft: string;
    topLeftSubscription: Subscription;
    topTitleSubscription: Subscription;
    topRightSubscription: Subscription;
    constructor(
        public router: Router,
        public store: Store<reducers.State>,
        public appService: AppService) {
        this.screenWidth = screen.width;

         
 
    this.topRight$ = store.pipe(select(reducers.layout_topRight));
    this.topLeft$ = store.pipe(select(reducers.layout_topLeft));
    this.topTitle$ = store.pipe(select(reducers.layout_topTitle));
    }

    ngOnDestroy() {
      //  if (this.topLeftSubscription) this.topLeftSubscription.unsubscribe();
      //  if (this.topTitleSubscription) this.topTitleSubscription.unsubscribe();
      //  if (this.topRightSubscription) this.topRightSubscription.unsubscribe();

        this.store.dispatch(LayoutActions.setTopLeft({ left: this.topLeft }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: this.topTitle }));
        this.store.dispatch(LayoutActions.setTopRight({ right: this.topRight}));

        if (this.qrcodeReaderSubscription) this.qrcodeReaderSubscription.unsubscribe();
        this.codeReader.reset();
    }
    ngOnInit() {}

    scanNext(deviceId?:string) {
        this.codeReader
            .decodeFromInputVideoDevice(deviceId, this.camera.nativeElement)
            .then((result: Result) => {
                this.appService.result$.next(result.getText());
            })
            .catch(err => console.log(err));
    }

    @ViewChild("camera2") set content(content: ElementRef) {
        if (content) {
            this.camera = content;
            this.codeReader = new BrowserQRCodeReader();
            try {
                this.codeReader.listVideoInputDevices().then((videoInputDevices: MediaDeviceInfo[]) => {
                    this.videoInputDevices = videoInputDevices;
                    if (videoInputDevices.length > 1) this.selectedVideoInputDevice = this.videoInputDevices[videoInputDevices.length-1];
                    else this.selectedVideoInputDevice = this.videoInputDevices[0];
                    this.qrcodeReaderSubscription = this.appService.qrcodeReader$.subscribe((qrcodeReader) => {
                        if (qrcodeReader) {



                            if (this.topLeftSubscription) this.topLeftSubscription.unsubscribe();
                            if (this.topTitleSubscription) this.topTitleSubscription.unsubscribe();
                            if (this.topRightSubscription) this.topRightSubscription.unsubscribe();

                            this.topRightSubscription = this.topRight$.subscribe((topRight) => this.topRight = topRight);
                            this.topTitleSubscription =   this.topTitle$.subscribe((topTitle) => this.topTitle = topTitle);
                            this.topLeftSubscription=   this.topLeft$.subscribe((topLeft) => this.topLeft = topLeft);
                            this.topLeftSubscription.unsubscribe();
                            this.topTitleSubscription.unsubscribe();
                            this.topRightSubscription.unsubscribe();

                            this.store.dispatch(LayoutActions.setTopLeft({ left: "預覽" }));
                            this.store.dispatch(LayoutActions.setTopTitle({ title: "掃碼" }));
                            this.store.dispatch(LayoutActions.setTopRight({ right: "空白" }));








                            if (this.codeReader.isVideoPlaying) this.scanNext(this.selectedVideoInputDevice.deviceId);
                        }
                    });
                }).catch(err => console.log(err));
            } catch (err) {
                console.log(err);
            }
        }
    }
}