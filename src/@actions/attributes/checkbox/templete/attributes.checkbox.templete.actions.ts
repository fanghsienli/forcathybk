import { createAction, props } from "@ngrx/store";
import { Attribute } from "@entities/attribute";

export const setFilter = createAction("[attributes.checkbox.templete] set anyLike", props<{ anyLike: string }>()); 
export const setItemId = createAction("[attributes.checkbox.templete] set item id", props<{ itemId: string}>()); 
export const setCategoryId = createAction("[attributes.checkbox.templete] set category id", props<{ categoryId: string}>()); 
export const setInventoryId = createAction("[attributes.checkbox.templete] set inventory id", props<{ inventoryId: string }>()); 
export const setSelectedIds = createAction("[attributes.checkbox.templete] set selected ids", props<{ selectedIds: string[] }>()); 

export const selectCheckbox = createAction("[attributes.checkbox.templete] select checkbox");
export const selectCheckboxSuccess = createAction("[attributes.checkbox.templete] select checkbox success", props<{ ids: string[] }>());
export const selectCheckboxError = createAction("[attributes.checkbox.templete] select checkbox error", props<{ error: any }>());