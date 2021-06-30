import { createAction, props } from "@ngrx/store";
import { ItemAttribute } from "@entities/item";


export const load = createAction("[itemAttribute/guard] Load Inventory", props<{ itemAttribute: ItemAttribute }>());

export const select = createAction("[itemAttributes.list.templete] select");
export const selectSuccess = createAction("[itemAttributes.list.templete] select ok", props<{ itemAttributes: ItemAttribute[] }>());
export const selectError = createAction("[itemAttributes.list.templete] select error", props<{ error: any }>());

export const setPageSize = createAction("[itemAttributes.list.templete] set pageSize", props<{ pageSize: number }>()); 

export const removeItemAttribute = createAction("[itemAttributes.list.templete] remove", props<{ itemAttribute: ItemAttribute }>());
export const removeSuccess = createAction("[itemAttributes.list.templete] remove success", props<{ itemAttribute: ItemAttribute }>());
export const removeFailure = createAction("[itemAttributes.list.templete] remove failure", props<{ itemAttribute: ItemAttribute }>());

export const Attribute = createAction("[itemAttributes.list.templete] new itemAttribute");
export const editItemAttribute = createAction("[itemAttributes.list.templete] edit itemAttribute", props<{ itemAttribute: ItemAttribute }>());
export const more = createAction("[itemAttributes.list.templete] more", props<{ buttons: any[] }>());
export const disableItemAttribute = createAction("[itemAttribute/database] update statusId");
export const enableItemAttribute = createAction("[itemAttribute/database] update statusId");

export const setFilter = createAction("[itemAttributes.list.templete] set filter", props<{ anyLike: string }>());
export const setSort = createAction("[itemAttributes.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
