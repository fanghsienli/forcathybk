import { createAction, props } from "@ngrx/store";
import { InventoryAttribute } from "@entities/inventory";

export const get = createAction("[inventoryAttributes.list.templete] get");
export const getOk = createAction("[inventoryAttributes.list.templete] get ok", props<{ inventoryAttributes: InventoryAttribute[] }>());
export const getError = createAction("[inventoryAttributes.list.templete] get error", props<{ error: any }>());
export const setPageSize = createAction('[inventoryAttributes.list.templete] set pageSize', props<{ pageSize: number }>());
export const setIds = createAction('[inventoryAttributes.list.templete] set ids', props<{ ids: string[] }>());
export const remove = createAction('[inventoryAttributes.list.templete] remove', props<{ inventoryAttribute: InventoryAttribute }>());
export const removeOk = createAction('[inventoryAttributes.list.templete] remove Ok');

export const more = createAction("[inventoryAttributes.list.templete] more", props<{ buttons: any[] }>());
export const setMode = createAction("[inventoryAttribute/page] set mode", props<{ mode: string }>());

export const deleteInventoryAttribute = createAction("[inventoryAttribute/database] delete");
export const locationBack = createAction("[inventoryAttribute/page] go to previous");
export const loadInventoryAttribute = createAction("[inventoryAttribute/page] find");
export const setInventoryAttribute = createAction('[inventoryAttribute/page] set inventoryAttribute', props<{ id: string }>());
export const setRecipe = createAction('[inventoryAttribute/page] set recipe');
export const setInventory = createAction('[inventoryAttribute/page] set inventory');
export const edit = createAction("[inventoryAttribute.list.templete] edit itemAttribute", props<{ inventoryAttribute: InventoryAttribute }>());



export const disableInventoryAttribute = createAction("[inventoryAttribute/database] update statusId");
export const enableInventoryAttribute = createAction("[inventoryAttribute/database] update statusId");
export const setFilter = createAction("[inventoryAttributes.list.templete] set filter", props<{ anyLike: string }>());
export const setSort = createAction("[inventoryAttributes.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());

