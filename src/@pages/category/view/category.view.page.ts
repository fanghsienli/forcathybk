import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AppService } from "@services/app.service";
import { Presentation } from "@models/app.model";
import { Observable, Subscription } from "rxjs";
import { FilesService } from "@services/files.service";
import { CategoriesService } from "@services/categories.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { CategoryViewPageActions } from "@actions/category";
import { map } from "rxjs/operators";
import * as categoryReducers from "@reducers/category";
import { Category } from "@entities/category";
import * as LayoutActions from "@actions/layout.actions";
import { Store, select } from "@ngrx/store";
import * as reducers from "@reducers";
@Component({
    selector: "categoryViewPage",
    templateUrl: "category.view.page.html",
    styleUrls: ["category.view.page.css"],
    host: { "class": "SCxLW uzKWK" }
})
export class CategoryViewPage implements OnInit {
    ngOnInitSubscription: Subscription;
    categorySubscription: Subscription;
    category: Category;
    categoriesSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    action: string;
    activatedRouteSubscription: Subscription;
    actionSubscription: Subscription;
    actionsSubscription: Subscription;
    loading: boolean;
    mode: string;
    constructor(
        public filesService: FilesService,
        public appService: AppService,
        public router: Router,
        public categoriesService: CategoriesService,
        public activatedRoute: ActivatedRoute,
        public store$: Store<reducers.State>,
        public categoryStore$: Store<categoryReducers.State>
    ) {

        this.actionsSubscription = activatedRoute.params
            .pipe(map(params => CategoryViewPageActions.setId({ id: params.id })))
            .subscribe(action => categoryStore$.dispatch(action));
        this.loading = true;
        //  this.store.pipe(select(categoryReducers.selectSelectedCategoryId));
    }

    ngOnDestroy() {
        if (this.actionsSubscription) this.actionsSubscription.unsubscribe();
        if (this.categorySubscription) this.categorySubscription.unsubscribe();
        if (this.categoriesSubscription) this.categoriesSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
    }

    getCategory(): Promise<Category> {
        if (this.categoriesSubscription) this.categoriesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.categoriesSubscription = this.categoriesService.find(this.appService.id).subscribe((category: Category) => {
                if (!category) this.router.navigate([`notFound`]);
                this.loading = false;
                resolve(category);
            });
        });
    }

    findCategory(): Promise<Category> {
        this.category = null;
        if (this.categorySubscription) this.categorySubscription.unsubscribe();
        return new Promise((resolve) => {
            this.categorySubscription = this.categoriesService.find(this.appService.id).subscribe((category: Category) => {
                if (!category) this.router.navigate([`notFound`]); 
                this.loading = false;
                resolve(category);
            });
        });
    }

    ngOnInit() {
        this.store$.dispatch(LayoutActions.setTopLeft({ left: "上頁" }));
        this.store$.dispatch(LayoutActions.setTopTitle({ title: "讀取中..." }));
        this.store$.dispatch(LayoutActions.setTopRight({ right: "掃碼" }));
        let bottom = this.appService.bottom$.getValue() || {};
        bottom.type = "nav";
        bottom.active = bottom.active || "搜尋";
        this.appService.bottom$.next(bottom);

        this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.categoryStore$.dispatch(CategoryViewPageActions.find({ id: paramMap.get("id") }));
            this.appService.id = paramMap.get("id");
            this.appService.module = this.activatedRoute.parent.snapshot.url[0].path;
            this.category = await this.findCategory();
            this.store$.dispatch(LayoutActions.setTopTitle({ title: `#${this.category.value}` }));
            this.mode = "itemsList";
            this.ngOnInitSubscription = this.categoryStore$.pipe(select(categoryReducers.categoryViewPage_upsertId)).subscribe((upsertId: string) => {
                if (this.categorySubscription) this.categorySubscription.unsubscribe();
                this.categorySubscription = this.categoryStore$.pipe(
                    select(categoryReducers.categoryEntities_category(), {
                        id: upsertId
                    })
                ).subscribe(async (category: Category) => {
                    if (category) {
                        this.category = category; 
                    }
                });
            });
        });
    }
    setMode(mode: string) {
        this.mode = mode;
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
