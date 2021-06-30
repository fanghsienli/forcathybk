import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { asyncScheduler, of, from } from "rxjs";
import { catchError, debounceTime, map, switchMap, withLatestFrom, concatMap, tap } from "rxjs/operators";
import { ItemsListTempleteActions } from "@actions/item";
import { ItemsService } from "@services/items.service";
import { Store, select, Action } from "@ngrx/store";
import * as reducers from "@reducers";
import * as itemReducers from "@reducers/item";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";
import { PresentationActions } from "@actions";
import { Item } from "@entities/item";
import { Category } from "@entities/category";
import { CategoriesService } from "@services/categories.service";

@Injectable()
export class ItemsListTempleteEffects {
    triggerSelectList$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
        this.actions$.pipe(
            ofType(
                ItemsListTempleteActions.setSort,
                ItemsListTempleteActions.setFilter,
                ItemsListTempleteActions.setPageIndex
            ),
            debounceTime(debounce, scheduler),
            switchMap(() => of(ItemsListTempleteActions.selectList()))
        )
    );

    selectList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemsListTempleteActions.selectList),
            concatMap(action => of(action).pipe(withLatestFrom(this.itemStore$.pipe(select(itemReducers.itemsListTempleteState))))),
            switchMap(([action, state]) => {
                return this.itemsService.selectList({
                    anyLike: state.anyLike,
                    categoryId: state.categoryId,
                    orderBy: state.orderBy,
                    descending: state.descending,
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize
                }).pipe(
                    map(x => ItemsListTempleteActions.selectListSuccess({
                        items: x.result,
                        total: x.total
                    })),
                    catchError(error => of(ItemsListTempleteActions.selectListFailure({ error })))
                );
            })
        )
    );

    remove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemsListTempleteActions.remove),
            switchMap((payload) => {
                let item = payload.item;
                this.itemStore$.dispatch(PresentationActions.message({ message: { h3: "刪除中", div: "刪除品項中, 請稍後..." } }));
                return this.itemsService.remove(payload.item.id).pipe(
                    tap(() => this.itemStore$.dispatch(PresentationActions.close({ message: `刪除品項: ${item.value} 成功!` }))),
                    map(() => ItemsListTempleteActions.removeSuccess({ item })),
                    catchError((x) => of(ItemsListTempleteActions.removeFailure({ item })))
                );
            })
        )
    );


    upload$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemsListTempleteActions.upload),
            switchMap((payload) => {

                return from(new Promise<Item[]>((resolve) => {

                    const wb: XLSX.WorkBook = XLSX.read(payload.bstr, { type: 'binary' });
                        const wsname: string = wb.SheetNames[0];
                        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                        let inputdata = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
                        
                        let promises = [];
                        let categoryValues = {};
                        let items = [];
                        for (let i = 1; i < inputdata.length; i++) {
                            let newItem = new Item();
                            newItem.code = inputdata[i][0] || "";
                            newItem.value = inputdata[i][1] || "";
                            newItem.description = inputdata[i][2] || "";
                            newItem.statusId = "005617b3-d283-461c-abef-5c0c16c780d0";
                            if (newItem.code !== "" && newItem.value !== "") {
                                newItem.description.split("#").map(x => x.trim()).filter(x => x !== "").forEach(categoryValue => {
                                    categoryValues[categoryValue] = categoryValue;
                                });
                                items.push(newItem);
                            }
                        }
                        
                        for (let categoryValue in categoryValues) {
                            let category = new Category();
                            category.value = categoryValue;
                            category.statusId = "005617b3-d283-461c-abef-5c0c16c780d0";
                            promises.push(this.categoriesService.create(category).toPromise());
                        }

                        Promise.all(promises).then((categories: Category[]) => {
                            console.log(categories);
                            let promises2 = [];
                            items.forEach(newItem => {
                                promises2.push(
                                    new Promise<Item>((resolve) => this.itemsService.create(newItem).toPromise().then(
                                        (createdItem: Item) => resolve(createdItem),
                                        () => {
                                            alert(`${newItem.code}上傳失敗`);
                                            resolve(null);
                                        })
                                    )
                                );
                            });
                            Promise.all(promises2).then((items: Item[]) => {
                                resolve(items);
                            });
                        });
                   
                })).pipe(
                    tap((items: Item[]) => this.itemStore$.dispatch(PresentationActions.close({ message: `上傳 ${items.length} 筆品項成功!` }))),
                    map((items: Item[]) => ItemsListTempleteActions.uploadSuccess({ items})),
                    catchError((error) => of(ItemsListTempleteActions.uploadFailure({ error })))
                );
            })
        )
    );

    itemEditTemplete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                ItemsListTempleteActions.editItem,
                ItemsListTempleteActions.newItem
            ),
            switchMap((payload) => {
                return of(PresentationActions.open({ title: "itemEditTemplete", width: "365px", payload }));
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store$: Store<reducers.State>,
        private itemStore$: Store<itemReducers.State>,
        private itemsService: ItemsService,
        private categoriesService: CategoriesService,
        public appService: AppService,
        public router: Router
    ) { }
}
