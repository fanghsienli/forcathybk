import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { FolderFilesService } from "@services/folderFiles.service";
import { InventoriesService } from "@services/inventories.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DialogService } from "@services/dialog.service";
import { Inventory } from "@entities/inventory";
import * as recipeReducers from "@reducers/recipe";
import * as attributeReducers from "@reducers/attribute";
import * as reducers from "@reducers";
import { SegmentationsService } from "@services/segmentations.service";
import { RecipeViewPageActions } from "@actions/recipe";
import * as LayoutActions from "@actions/layout.actions";
import { map, switchMap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { ItemsService } from "@services/items.service";
import { Attribute } from "@entities/attribute";
import { ItemViewPageActions } from "@actions/item";
@Component({
    selector: "recipeViewPage",
    templateUrl: "recipe.view.page.html",
    styleUrls: ["recipe.view.page.css"],
    host: { "class": "SCxLW uzKWK", "style": "padding-bottom:44px" }
})
export class RecipeViewPage implements OnInit {
    activatedRouteSubscription: Subscription;
    params: any;
    paramsSubscription: Subscription;
    recipeGridsFilter: any;
    recipe: Inventory;
    presentationSubscription: Subscription;
    positionSubscription: Subscription;
    recipeGridSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    position$: Observable<Position> = this.appService.position$;
    action: string;
    actionSubscription: Subscription;
    recipe$: Observable<Inventory>;
    @ViewChild("hiddenUpload") hiddenUpload: ElementRef;
    recipeSubscription: Subscription;
    actionsSubscription: Subscription;
    loading: boolean;
    mode$: Observable<string>;
    checkedAttributes: Attribute[] = [];
    attributes$: Observable<Attribute[]>;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public inventoriesService: InventoriesService,
        public activatedRoute: ActivatedRoute,
        public folderFilesService: FolderFilesService,
        public dialogService: DialogService,
        public segmentationsService: SegmentationsService,
        public store: Store<reducers.State>,
        public recipeStore: Store<recipeReducers.State>,
        public attributeStore: Store<attributeReducers.State>,
        public itemsService: ItemsService,
        route: ActivatedRoute
    ) {
        this.attributes$ = this.recipeStore.select(recipeReducers.recipeViewPage_attributeIds).pipe(switchMap((ids:string[]) =>

            this.attributeStore.select(attributeReducers.attributeEntities_attributes(), { ids })
        ));
        this.actionsSubscription = route.params.pipe(map(params => RecipeViewPageActions.setId({ id: params.id }))).subscribe(action => recipeStore.dispatch(action));
        this.loading = true;
        this.setMode("inputs");

        this.recipe$ = recipeStore.pipe(select(recipeReducers.recipeViewPage_recipe));
        this.mode$ = recipeStore.pipe(select(recipeReducers.recipeViewPageMode));
    }
    setMode(mode: string) {
        this.checkedAttributes = [];
        let attribute_number = new Attribute();
        attribute_number.code = "quantity";
        attribute_number.id = "28597E59-CE72-4FF4-8A79-676D3546B13E";
        attribute_number.value = "產量";
        let attribute_unit = new Attribute();
        attribute_unit.code = "unit";
        attribute_unit.id = "10F7AC6D-0BDF-404F-BD97-CEEC81B03DA0";
        attribute_unit.value = "單位";
        switch (mode) {
            case "inputs":
                let attribute_inputItem = new Attribute();
                attribute_inputItem.id = "6b5b9acf-724f-47c4-89c6-70c9cd42c6bd";
                attribute_inputItem.code = "inputItem";                
                attribute_inputItem.value = "輸入品項";
                this.checkedAttributes.push(attribute_inputItem);
                this.checkedAttributes.push(attribute_number);
                this.checkedAttributes.push(attribute_unit);
                break;
            case "availableWorkStations":
                let attribute_target = new Attribute();
                attribute_target.code = "target";
                attribute_target.id = "428208E8-509B-4B66-BABC-1EF59D283EFF";
                attribute_target.value = "工作站點";
                this.checkedAttributes.push(attribute_target);
                break;
            case "outputs":
                let attribute_outputItem = new Attribute();
                attribute_outputItem.id = "6b5b9acf-724f-47c4-89c6-70c9cd42c6bd";
                attribute_outputItem.code = "outputItem";
                attribute_outputItem.value = "輸出品項";
                this.checkedAttributes.push(attribute_outputItem);
                this.checkedAttributes.push(attribute_number);
                this.checkedAttributes.push(attribute_unit);
                break;
            default:
        }

        this.recipeStore.dispatch(RecipeViewPageActions.setMode({ mode }));
    }
    nextAction(action: string) {
        this.appService.action$.next(action);
    }

    ngOnDestroy() {
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.recipeSubscription) this.recipeSubscription.unsubscribe();
        if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    openPrint(recipeId: string) {
        window.open(`print/recipes/${recipeId}`);
    }

    goToItem(itemId: string) {
        this.router.navigate([`items/${itemId}`]);
    }

    goToRecipe(recipeId: string) {

        this.router.navigate([`recipes/${recipeId}`]);
    }

    goToRecipesPrint(recipeId: string) {
        this.router.navigate([`recipes/${recipeId}/edit`]);
    }

    uploadExcel(evt: any) { }

    more() {
        let presentation = {
            title: "more",
            buttons: [ ]
        };
       presentation.buttons.push(
            {
                color: "blue",
                title: "編輯",
               action: "edit",
               params: { id: this.recipe.id }
            },
            {
                color: "red",
                title: "刪除",
                action: "remove",
                params: { id: this.recipe.id }
            });


        presentation.buttons = presentation.buttons.map(b => {
            b.action = RecipeViewPageActions[b.action];
            return b;
        });

        let buttons = presentation.buttons;
        this.recipeStore.dispatch(RecipeViewPageActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }
    ngOnInit() {









        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));

        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "首頁";
        this.appService.bottom$.next(bottom);
        this.recipeSubscription = this.recipe$.subscribe((recipe: Inventory) => {
            if (recipe) {
                this.recipe = recipe;
                this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                this.store.dispatch(LayoutActions.setTopTitle({ title: recipe.no }));
                this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
                this.loading = false;
            }
        });
        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (this.appService.module === "recipes") {
                    this.action = action;
                    let bottom = this.appService.bottom$.getValue() || {};
                    this.appService.presentation$.next(null);
                    switch (this.action) {
                        case "預覽":

                            //this.appService.top$.next({ left: "上頁", title: this.recipe.no, right: "掃碼" });
                            bottom.type = "nav";
                            bottom.active = bottom.active || "首頁";
                            this.appService.bottom$.next(bottom);
                            break;
                        default:
                            break;
                    }
                }
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
