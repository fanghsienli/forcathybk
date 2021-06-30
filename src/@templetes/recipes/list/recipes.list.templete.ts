import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Inventory } from "@entities/inventory";
import { PositionsService } from "@services/positions.service";
import { SegmentationsService } from "@services/segmentations.service";
import { RecipesListTempleteActions } from "@actions/recipe";
import { Store, select } from "@ngrx/store";
import * as recipeReducers from "@reducers/recipe";
import * as attributeReducers from "@reducers/attribute";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { Attribute } from "@entities/attribute";

@Component({
    selector: "recipesListTemplete",
    templateUrl: "recipes.list.templete.html",
    styleUrls: ["recipes.list.templete.css"]
})
export class RecipesListTemplete implements OnInit {
    hoverId: string;
    action: string;
    actionSubscription: Subscription;
    recipesSubscription: Subscription;
    @ViewChild("exportTable") exportTable: ElementRef;
    activatedRouteSubscription: Subscription;
    anyLike: string = "";
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    loading$: Observable<boolean>;
    checkedAttributes$: Observable<Attribute[]>;
    maxPage: number = 1;
    orderBy: any;
    descending: boolean;
    loading: boolean;
    pageIndex: number = 0;
    pageSize: number = 15;
    recipes: Inventory[];
    ngOnInitSubscription: Subscription;
    resultCount: number = 0;
    total$: Observable<number>;
    selectedRecipe: Inventory;
    presentationSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public inventoriesService: InventoriesService,
        public segmentationsService: SegmentationsService,
        public positionsService: PositionsService,
        public appService: AppService,
        private recipeStore: Store<recipeReducers.State>,
        private attributeStroe: Store<attributeReducers.State>
    ) {
        this.recipeStore.dispatch(RecipesListTempleteActions.setPageSize({ pageSize: this.pageSize }));
        this.total$ = this.recipeStore.select(recipeReducers.recipesListTemplete_total);
        this.checkedAttributes$ = this.attributeStroe.select(attributeReducers.attributesCheckboxTemplete_checkedAttributes());
        this.recipes = new Array<Inventory>();
    }

    typeOf(any: any) {
        if (typeof any === "object") return Object.prototype.toString.call(any);
        return typeof any;
    }
    openInventory(inventoryId: string) {
        window.open(`inventories/${inventoryId}`);
    }
    openItem(itemId: string) {
        window.open(`items/${itemId}`);
    }

    async sort(orderBy: string) {
        if (this.orderBy === orderBy) this.descending = this.descending ? false : true;
        else {
            this.orderBy = orderBy;
            this.descending = false;
        }
        this.recipeStore.dispatch(RecipesListTempleteActions.setSort({
            orderBy: this.orderBy,
            descending: this.descending
        }));
        this.reLoad(1);
    }

    exportExcel(): void {
        const wb = XLSX.utils.table_to_book(this.exportTable.nativeElement);
        XLSX.writeFile(wb, "export.xlsx");
    }

    ngOnDestroy() {
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
        if (this.recipesSubscription) this.recipesSubscription.unsubscribe();
        if (this.activatedRouteSubscription) this.activatedRouteSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
        if (this.presentationSubscription) this.presentationSubscription.unsubscribe();
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.recipeStore.dispatch(RecipesListTempleteActions.setFilter({ anyLike: anyLike }));
            this.reLoad(1);
        });

        if (!this.activatedRouteSubscription) this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
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

        //當刪除時
        this.ngOnInitSubscription.add(
            this.recipeStore.pipe(select(recipeReducers.recipesListTemplete_removeId)).subscribe((removedId: string) => {
                
                if (this.recipes.find(x => x.id === removedId)) this.resultCount--;
                this.recipes = this.recipes.filter(x => x.id !== removedId);
            })
        );
    }

    goToRecipe(recipeId: string) {
        this.router.navigate([`recipes/${recipeId}`]);
    }

    editRecipe(recipeId: string) {
        this.router.navigate([`recipes/${recipeId}/edit`]);
    }

    filterRecipes(anyLike: string) {
        this.anyLike$.next(anyLike);
    }

    getRecipes(): Promise<Inventory[]> {
        if (this.recipesSubscription) this.recipesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.recipesSubscription = this.recipeStore.pipe(
                select(recipeReducers.getRecipes()),
                filter(x => x.loaded)
            ).subscribe(result => {
                this.resultCount = result.count;
                this.maxPage = Math.ceil(this.resultCount / this.pageSize);
                this.anyLike = result.anyLike;
                resolve(result.recipes);
            });
        });
    }

    async load(debounceTime: number) {
        if (this.pageIndex < this.maxPage) {
            this.pageIndex++;
            this.recipeStore.dispatch(RecipesListTempleteActions.setPageIndex({
                pageIndex: this.pageIndex
            }));
            this.loadMore(debounceTime);
        }
    }

    async reLoad(debounceTime: number) {
        this.recipes = [];
        this.pageIndex = 1;
        this.loadMore(debounceTime);
    }

    delete(recipe: Inventory) {
        this.recipeStore.dispatch(RecipesListTempleteActions.remove({ recipe }));
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreRecipes = await this.getRecipes();
        if (moreRecipes.length > 0) {
            let pageYOffset = window.pageYOffset;
            moreRecipes.forEach(recipe => {
                this.recipes.push({ ...recipe });
            });
            for (let i = (this.recipes.length - moreRecipes.length); i < this.recipes.length; i++) {
                this.inventoriesService.findDetails(this.recipes[i].id).toPromise().then((details: Inventory) => {
                    let recipe = {
                        ...this.recipes[i], ...details
                    };
                    if (this.recipes[i]) {
                        if (this.recipes[i].id === recipe.id) {
                            this.recipes[i] = recipe;
                        }
                    }
                });
            }
            window.scrollTo({ top: pageYOffset });
            setTimeout(() => this.loading = false, debounceTime);
        } else {
            setTimeout(() => this.loading = false, debounceTime);
        }
    }

    more(recipe: Inventory) {
        this.selectedRecipe = { ...recipe };
        this.selectedRecipe._take = 0;
        this.hoverId = this.selectedRecipe.id;
        let presentation = {
            title: "more",
            buttons: [
                {
                    color: "blue",
                    title: "編輯",
                    action: "goToEdit",
                    params: { ...this.selectedRecipe },
                    attributes: ["id"]
                },
                {
                    color: "red",
                    title: "刪除",
                    params: {
                        recipe: { ...this.selectedRecipe }
                    },
                    action: "remove"
                }
            ]
        };

        presentation.buttons = presentation.buttons.map(button => {
            button.action = RecipesListTempleteActions[button.action];
            return button;
        });
        let buttons = presentation.buttons;
        this.recipeStore.dispatch(RecipesListTempleteActions.more({ buttons }));
        this.appService.presentation$.next(presentation);
    }
}