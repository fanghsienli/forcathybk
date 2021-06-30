import { createAction, props } from "@ngrx/store"; 
import { Inventory } from "@entities/inventory";

export const create = createAction("[recipes.list.templete] create", props<{ recipe: Inventory }>());
export const createSuccess = createAction("[recipes.list.templete] create success", props<{ recipe: Inventory }>());
export const createFailure = createAction("[recipes.list.templete] create failure", props<{ recipe: Inventory }>());
export const update = createAction("[recipes.list.templete] update", props<{ recipe: Inventory }>());
export const updateSuccess = createAction("[recipes.list.templete] update success", props<{ recipe: Inventory }>());
export const updateFailure = createAction("[recipes.list.templete] update failure", props<{ recipe: Inventory }>());
export const setSort = createAction("[recipes.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[recipes.list.templete] set filter", props<{ anyLike: string }>());
export const setPageIndex = createAction('[recipes.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[recipes.list.templete] set pageSize', props<{ pageSize: number }>());

export const selectList = createAction("[recipes.list.templete] select list");
export const selectListSuccess = createAction("[recipes.list.templete] select list success", props<{ recipes: Inventory[], total: number }>());
export const selectListFailure = createAction("[recipes.list.templete] select list failure", props<{ error: any }>());

export const editRecipe = createAction("[recipes.list.templete] edit recipe", props<{ recipe: Inventory }>());
export const newRecipe = createAction("[recipes.list.templete] new recipe");

export const exportOk = createAction("[recipes.list.templete] export ok");

export const remove = createAction("[recipes.list.templete] remove", props<{ recipe: Inventory }>());
export const removeSuccess = createAction("[recipes.list.templete] remove success", props<{ recipe: Inventory }>());
export const removeFailure = createAction("[recipes.list.templete] remove failure", props<{ recipe: Inventory }>());


export const edit = createAction("[recipes.list.templete] edit");
export const more = createAction("[recipes.list.templete] more", props<{ buttons: any[] }>());
export const setEmpty = createAction("[recipes.list.templete] remove filter - all");

export const goToEdit = createAction("[recipes.list.templete] go to edit", props<{ id: string }>());
export const goToEditOk = createAction("[recipes.list.templete] go to edit ok");