import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { SwUpdate } from '@angular/service-worker';
import { Presentation } from "@models/app.model";
import { select, Store } from "@ngrx/store";
import * as reducers from "@reducers";
import * as workOrderReducers from "@reducers/workOrder";
import { AppService } from "@services/app.service";
import { SettingsService } from "@services/settings.service";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { WorkOrderViewPageActions } from '../@actions/workOrder';
import { Inventory } from '../@entities/inventory';
import { Setting } from '../@models/setting';
@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    profileSubscription: Subscription;
    qrcodeReader: boolean;
    qrcodeReaderSubscription: Subscription;
    presentation$: Observable<Presentation>;
    instances$: Observable<any[]> = this.appService.positions$;
    blockBlur: boolean;
    inited = false;
    message: string;
    top: any;
    topSubscription: Subscription;
    bottom: any;
    bottomSubscription: Subscription;
    settingSubscription: Subscription;
    presentation: any;
    presentationSubscription: Subscription;
    routerSubscription: Subscription;
    activatedRouteSubscription: Subscription;
    isLogout: boolean;
    messageSubscription: Subscription;
    resultSubscription: Subscription;
    presentationType$: Observable<string>;
    presentationTitle$: Observable<string>;
    topTitle$: Observable<string>;
    constructor(
        public router: Router,
        public appService: AppService,
        public settingsService: SettingsService,
        private location: Location,
        public activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        updates: SwUpdate,
        public workOrderStore$: Store<workOrderReducers.State>,
        public store: Store<reducers.State>) {
        this.topTitle$ = store.pipe(select(reducers.layout_topTitle));
        this.presentationType$ = store.pipe(select(reducers.presentation_type));
        this.presentationTitle$ = store.pipe(select(reducers.presentation_title));
        this.message = "";
        this.isLogout = false;
        this.qrcodeReader = false;
        updates.available.subscribe(event => {
            updates.activateUpdate().then(() => document.location.reload());
        });
    }

    ngOnDestroy() {
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.topSubscription) this.topSubscription.unsubscribe();
        if (this.bottomSubscription) this.bottomSubscription.unsubscribe();
        if (this.routerSubscription) this.routerSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.settingSubscription) this.settingSubscription.unsubscribe();
        if (this.qrcodeReaderSubscription) this.qrcodeReaderSubscription.unsubscribe();
        if (this.messageSubscription) this.messageSubscription.unsubscribe();
        if (this.resultSubscription) this.resultSubscription.unsubscribe();
    }

    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
    up: boolean;
    ngOnInit() {
        this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((x) => {
            let qrcodeReader = this.appService.qrcodeReader$.getValue();
            if (qrcodeReader) this.appService.qrcodeReader$.next(false);
        });

        this.settingSubscription = this.settingsService.select().subscribe((setting: Setting) => {
            this.appService.profile = setting.profile;
        });

        this.appService.message$.subscribe((message: string) => {
            if (message.length > 0) {
                this.up = true;
                this.message = message;
                setTimeout(() => {
                    this.message = "";
                    setTimeout(() => {
                        this.up = false;
                    }, 200);
                }, 5000);
            }
        });

        this.presentation$ = this.appService.presentation$.pipe(tap((presentation: Presentation) => {
            if (presentation && presentation.h3 === "選擇數量") {
                this.blockBlur = false;
                setTimeout(() => { this.blockBlur = true; }, 1500);
            }
        }));

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {

            this.presentation = presentation;
        });

        this.bottomSubscription = this.appService.bottom$.subscribe((bottom: any) => {
            if (this.bottom !== bottom) this.bottom = bottom;
        });

        this.qrcodeReaderSubscription = this.appService.qrcodeReader$.subscribe((qrcodeReader: boolean) => {
            
            this.qrcodeReader = qrcodeReader;
        });

        this.resultSubscription = this.appService.result$.subscribe((result: string) => {


            if (result&&result.length>116&&result.substr(0, 6) === "pickup") {
                let workOrderEvent = new Inventory();


                let putdownCommand = result.split("_")[1]+"_"+  result.split("_")[2];

                let workOrderId = result.split("_")[2].substring(0, 36);
    
               
                this.workOrderStore$.dispatch(WorkOrderViewPageActions.putdown({  putdownCommand}));
                this.qrcodeReader = false;
                this.router.navigate(["./workOrders/" + workOrderId]);
               
               // this.store.dispatch(WorkOrderEditTempleteActions.create({ workOrderWithAttributes: { ...workOrderEvent, attributes: workOrderEventAttributes } }));













            } else {
                //不是錢包模式 直接導航
                if (this.appService.module !== "wallet" && result.length > 36) {
                    this.router.navigate([result]);
                    this.appService.result$.next("");
                    this.appService.action$.next("預覽");
                }

            }





            
        });
    }

    blur() {
        if (this.blockBlur) this.appService.presentation$.next(null);
    }

    presentationClick(button: string) {
        switch (button) {
            case "上傳相片":
                this.appService.presentation$.next({ action: "上傳相片" });
                break;
            case "登出":
                this.appService.logout();
                this.router.navigate(["./login"]);
                break;
            default:
                break;
        }
    }

    back() {
        this.location.back();
    }
}
