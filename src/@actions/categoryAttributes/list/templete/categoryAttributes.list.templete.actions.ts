import { createAction, props } from "@ngrx/store";
import { CategoryAttribute } from "@entities/category";


export const select = createAction("[categoryAttributes.list.templete] select");
export const selectSuccess = createAction("[categoryAttributes.list.templete] select ok", props<{ categoryAttributes: CategoryAttribute[] }>());
export const selectError = createAction("[categoryAttributes.list.templete] select error", props<{ error: any }>());

export const setPageSize = createAction("[categoryAttributes.list.templete] set pageSize", props<{ pageSize: number }>());

export const removeCategoryAttribute = createAction("[categoryAttributes.list.templete] remove", props<{ categoryAttribute: CategoryAttribute }>());
export const removeSuccess = createAction("[categoryAttributes.list.templete] remove success", props<{ categoryAttribute: CategoryAttribute }>());
export const removeFailure = createAction("[categoryAttributes.list.templete] remove failure", props<{ categoryAttribute: CategoryAttribute }>());

export const Attribute = createAction("[categoryAttributes.list.templete] new categoryAttribute");
export const editCategoryAttribute = createAction("[categoryAttributes.list.templete] edit categoryAttribute", props<{ categoryAttribute: CategoryAttribute }>());
export const more = createAction("[categoryAttributes.list.templete] more", props<{ buttons: any[] }>());
export const disableCategoryAttribute = createAction("[categoryAttribute/database] update statusId");
export const enableCategoryAttribute = createAction("[categoryAttribute/database] update statusId");

export const setFilter = createAction("[categoryAttributes.list.templete] set filter", props<{ anyLike: string }>());
export const setSort = createAction("[categoryAttributes.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
