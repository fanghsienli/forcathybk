import { Component, OnInit, ViewChild, ElementRef, HostBinding } from "@angular/core";
import { AppService } from "@services/app.service";
import { Observable, Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { File } from "@entities/entity";
import { FileSave } from "@models/entity";
import { FilesService } from "@services/files.service";
import { Inventory } from "@entities/inventory";
import { InventoriesService } from "@services/inventories.service";
import { ItemsService } from "@services/items.service";
import * as profileReducers from "@reducers/profile";
import { ProfileViewPageActions } from "@actions/profile";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
import { PresentationActions } from "../../../@actions";
@Component({
    selector: "profileViewPage",
    templateUrl: "profile.view.component.html",
    styleUrls: ["profile.view.component.css"],
    host: { "class": "SCxLW uzKWK", "role": "main" }
})
export class ProfileViewComponent implements OnInit {
    presentation$: Observable<any> = this.appService.presentation$;
    @ViewChild("createFileInput", { static: true }) createFileInput: ElementRef;
    @HostBinding("class.uzKWK") uzKWK: boolean = false;
    @HostBinding("class.o64aR") o64aR: boolean = false;
    statusId: string;

    activatedRouteSubscription: Subscription;
    action: string;
    actionSubscription: Subscription;
    presentationSubscription: Subscription;
    resultSubscription: Subscription;
    profileSubscription: Subscription;
    routerSubscription: Subscription;
    uploading: boolean;

    itemDraftQuantity: number;
    itemQuantity: number;
    itemsSubscription: Subscription;
    itemsSubscription2: Subscription;
    constructor(private router: Router,
        public filesService: FilesService,
        public appService: AppService,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public store: Store<reducers.State>,
        public profileStore: Store<profileReducers.State>,
        public itemsService: ItemsService
    ) {
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }

    ngOnDestroy() {
        if (this.resultSubscription) this.resultSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.routerSubscription) this.routerSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.itemsSubscription) this.itemsSubscription.unsubscribe();
        if (this.itemsSubscription2) this.itemsSubscription2.unsubscribe();
    }

    more() {
        let presentation = {
            title: "more",
            buttons: [
                {                    
                    color: "red", 
                    title: `登出`,
                    action: "logout",
                    params: { oldAction: "登出(ProfileViewPageActions)" }
                }
            ]
        };
        presentation.buttons = presentation.buttons.map(b => {
            b.action = ProfileViewPageActions[b.action];
            return b;
        });
        let buttons = presentation.buttons;
        this.profileStore.dispatch(ProfileViewPageActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }

    async ngOnInit() { 
        this.inventoriesService.find(this.appService.profile.id).subscribe((profile: Inventory) => {
            debugger
            this.appService.profile = profile;
        });


        this.store.dispatch(LayoutActions.setTopLeft({ left: "商標" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "商標" }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" })); 
        this.appService.bottom$.next({ type: "nav", active: "個人" });
        this.appService.action$.next("預覽");
        if (this.appService.mobile) {
            this.uzKWK = true;
            this.o64aR = false;
        } else {
            this.uzKWK = false;
            this.o64aR = true;
        }

        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = "";
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";

        })

        this.actionSubscription = this.appService.action$.subscribe((action: string) => {
            
            if (this.action !== action) {
                this.action = action;
                switch (this.action) {
                    case "預覽":
                      
                        this.appService.bottom$.next({ type: "nav", active: "個人" });
                        break;
                    case "登出(ProfileViewPageActions)":
                        this.appService.presentation$.next({ action: "訊息", h3: "登出中", div: "登出中, 請稍後..." });
                        this.appService.logout();
                        this.router.navigate(['/login']);
                        this.appService.message$.next("已登出");
                        this.store.dispatch(PresentationActions.close({ message: "" }))
                        break;
                    default:
                        break;
                }
            }
        });
        let createdById = null;
        if (this.appService.module === "profile") createdById = this.appService.profile.id;
        if (!this.itemsSubscription) this.itemsSubscription = this.itemsService.count({
            createdById: createdById,
            statusId: "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5"
        }).subscribe((itemDraftQuantity: number) => {
            this.itemDraftQuantity = itemDraftQuantity;
        });
        if (!this.itemsSubscription2) this.itemsSubscription2 = this.itemsService.count({
            createdById: createdById,
            statusId: "005617b3-d283-461c-abef-5c0c16c780d0"
        }).subscribe((itemQuantity: number) => {
            this.itemQuantity = itemQuantity;
        });
        this.presentationSubscription = this.appService.presentation$.subscribe((presentation) => {
            console.log(this.appService.profile);
            if (typeof (presentation) === "string") {
                switch (presentation) {
                    case "上傳相片":
                        this.createFileInput.nativeElement.click();
                        this.appService.presentation$.next(null);
                        break;
                    case "移除目前的大頭貼照":
                        this.uploading = true;
                        this.appService.profile.photoId = null;
                        this.inventoriesService.update(this.appService.profile.id, this.appService.profile).subscribe((profile: Inventory) => {
                            this.appService.profile = profile;
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
            this.inventoriesService.update(this.appService.profile.id, this.appService.profile).subscribe((profile: Inventory) => {
                this.appService.profile = profile;
            });
            this.appService.profile.photo = fileSave.photos[0];
            this.uploading = false;
            this.appService.message$.next("大頭貼照已變更。");
        });
    }

    nextAction(action: string) {
        this.appService.action$.next(action);
    }

    edit() {
        this.appService.action$.next("預覽");
        this.router.navigate(["inventories/" + this.appService.profile.id+"/edit"]);
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
