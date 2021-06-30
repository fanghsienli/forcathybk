import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { AttributesService } from "@services/attributes.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
import * as attributeReducers from "@reducers/attribute";
@Component({
    selector: "attributeViewPage",
    templateUrl: "attribute.view.page.html",
    styleUrls: ["attribute.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class AttributeViewPage implements OnInit { 
    attributesSubscription: Subscription;
    attributeGrid: any;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    action: string;
    activatedRouteSubscription: Subscription;
    actionSubscription: Subscription;
    actionsSubscription: Subscription;
    loading: boolean;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public store: Store<reducers.State>,
        public attributesService: AttributesService,
        public activatedRoute: ActivatedRoute,
        public attributeStore: Store<attributeReducers.State>
    ) {
        this.loading = true;
    }

    ngOnDestroy() {
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
        if (this.attributesSubscription) this.attributesSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
    }

    getAttributeGrid(): Promise<any> {
        if (this.attributesSubscription) this.attributesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.attributesSubscription = this.attributesService.getGrid(this.appService.id).subscribe((attributeGrid: any) => {
                if (!attributeGrid) this.router.navigate([`notFound`]);
                this.loading = false;
                resolve(attributeGrid);
            });
        });
    }

    ngOnInit() { 
        this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "搜尋";
        this.appService.bottom$.next(bottom);

        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.appService.action = "";
            this.attributeGrid = await this.getAttributeGrid();
            if (!this.actionSubscription) this.actionSubscription = this.appService.action$.subscribe(async (action: string) => {
                if (!action) action = "預覽";
                if (this.appService.module === "attributes" && action && this.action !== action) {
                    this.action = action;
                    let bottom = this.appService.bottom$.getValue() || {};
                    switch (this.action) {
                        case "預覽":
                            this.store.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
                            this.store.dispatch(LayoutActions.setTopTitle({ title: `#${this.attributeGrid.attribute.value}` }));
                            this.store.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
                            bottom.type = "nav";
                            bottom.active = bottom.active || "搜尋";
                            this.appService.bottom$.next(bottom);
                            break;
                        default:
                            break;
                    }
                }
            });
        })
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
