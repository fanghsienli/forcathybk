import { Component, OnInit, ViewChild, ElementRef, HostBinding } from "@angular/core";
import { AppService } from "@services/app.service";
import { Observable, Subscription, from, BehaviorSubject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { File } from "@entities/entity";
import { FileSave } from "@models/entity";
import { FilesService } from "@services/files.service";
import { InventoriesService } from "@services/inventories.service";
import { Inventory } from "@entities/inventory";
import { ItemsService } from "@services/items.service";  
import { Attribute } from "@entities/attribute";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
@Component({
    selector: "home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.css"],
    host: { "class": "SCxLW uzKWK", "role": "main" }
})
export class HomeComponent implements OnInit {
    presentation$: Observable<any> = this.appService.presentation$;
    @ViewChild("createFileInput", { static: true }) createFileInput: ElementRef;
    @ViewChild("MreMs", { static: true }) MreMs: ElementRef;
    @HostBinding("class.uzKWK") uzKWK: boolean = false;
    @HostBinding("class.o64aR") o64aR: boolean = false;
    statusId: string;    
    activatedRouteSubscription: Subscription;
    action: string;
    actionSubscription: Subscription;
    presentationSubscription: Subscription;
    resultSubscription: Subscription;
    inventorySubscription: Subscription;
    routerSubscription: Subscription;
    uploading: boolean;
    attributes: Attribute[];

    hoverId: string;
    constructor(
        private router: Router,
        public filesService: FilesService,
        public appService: AppService,
        public itemsService: ItemsService,
        public store: Store<reducers.State>,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute
    ) {
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
        this.hoverId = "";
    }

    
    ngOnDestroy() {
        if (this.resultSubscription) this.resultSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.routerSubscription) this.routerSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    

    onPanEnd(e): void {
        let eX = 0;
        if (e.deltaX > 242) eX = 242;
        else {
            if (e.deltaX < -242) eX = -242;
            eX = e.deltaX;
        }
        let x = 0;
        if (((-1 * eX) % 161) > 80) x = (((-1 * eX) - ((-1 * eX) % 161)) / 161 + 1) * 161;
        else x = (((-1 * eX) - ((-1 * eX) % 161)) / 161) * 161;

        let fx = ((-1 * x) > 0 ? 0 : (-1 * x));
        if (fx < -140) fx = -141;

        this.MreMs.nativeElement.style.transitionDuration = ((-1 * fx) * 0.003) + "s";
        this.MreMs.nativeElement.style.transform = "translateX(" + fx + "px)";
    }

    onPanMove(e) {
        let x = 0;
        if (e.deltaX > 181) x = 181;
        else {
            if (e.deltaX < -181) x = -181;
            else x = e.deltaX;
        }
        this.MreMs.nativeElement.style.transform = "translateX(" + x + "px)";
    }

 

    ngOnInit() {
       

        this.store.dispatch(LayoutActions.setTopLeft({ left: "商標" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "商標" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" })); 
        this.appService.bottom$.next({ type: "nav", active: "首頁" });
        this.appService.action$.next("預覽"); 
        if (this.appService.mobile) {
            this.uzKWK = true;
            this.o64aR = false;
        } else {
            this.uzKWK = false;
            this.o64aR = true;
        }

        this.actionSubscription = this.appService.action$.subscribe((action: string) => {          
            if (this.action !== action) {
                this.action = action;
                switch (this.action) {
                    case "預覽":
                        
                        this.store.dispatch(LayoutActions.setTopLeft({ left: "商標" }));
                        this.store.dispatch(LayoutActions.setTopTitle({ title: "商標" }));
                        this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" })); 
                        this.appService.bottom$.next({ type: "nav", active: "首頁" });
                        break; 
                    default:
                        break;
                }
            }
        });

        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            if (typeof (presentation) === "string") {
                switch (presentation) {
                    case "上傳相片":
                        this.createFileInput.nativeElement.click();
                        this.appService.presentation$.next(null);
                        break;
                    case "移除目前的大頭貼照":
                        this.uploading = true;
                        this.appService.profile.photoId = null;
                        this.inventoriesService.update(this.appService.profile.id, this.appService.profile).subscribe((inventory: Inventory) => {
                            this.appService.profile = inventory;
                        });
                        this.appService.profile.photo = null;
                        this.appService.presentation$.next(null);
                        this.uploading = false;
                        this.appService.message$.next("大頭貼照已移除。");
                        break;
                    default:
                        break;
                }
            }
        }); 
    }

    changePhoto() {
        if (this.appService.profile.photo) this.appService.presentation$.next("變更大頭貼照");
        else this.createFileInput.nativeElement.click();
    }

    createFile(event) {
        this.uploading = true;
        this.filesService.create(<Array<File>>event.target.files, "inventories/" + this.appService.profile.id).subscribe((fileSave: FileSave) => {
            this.appService.profile.photoId = fileSave.photos[0].id;
            this.inventoriesService.update(this.appService.profile.id, this.appService.profile).subscribe((inventory: Inventory) => {
                this.appService.profile = inventory;
            });
            this.appService.profile.photo = fileSave.photos[0];
            this.uploading = false;
            this.appService.message$.next("大頭貼照已變更。");
        });
    }

    openParticipates() {
        this.appService.presentation$.next({
            h3: "",
            div: "進行中任務"
        });
    }

    openActivities() {
        this.appService.presentation$.next({
            h3: "",
            div: "可接受任務",
            button: "優先任務",
            buttons: ["優先任務", "其他推薦任務"]
        });
    }

    openSettings() {
        this.appService.presentation$.next({
            h3: "編輯個人檔案",
            buttons: [
                "更改密碼",
                "名牌",
                "授權的應用程式",
                "通知",
                "隱私設定和帳號安全",
                "登出",
                "取消"
            ]
        });
    }
}
