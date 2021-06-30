import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";
 
 
export const setIds = createAction('[items.list.templete] set ids', props<{ ids: string[] }>()); 
export const removeOk = createAction('[items.list.templete] remove Ok');

export const setMode = createAction("[item/page] set mode", props<{ mode: string }>());

export const deleteItem = createAction("[item/database] delete");
export const locationBack = createAction("[item/page] go to previous");
export const loadItem = createAction("[item/page] find");
export const setItem = createAction('[item/page] set item', props<{ id: string }>());
export const setRecipe = createAction('[item/page] set recipe');
export const setInventory = createAction('[item/page] set inventory');

export const setSort = createAction("[items.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[items.list.templete] set filter", props<{ anyLike: string }>());
export const setPageIndex = createAction('[items.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[items.list.templete] set pageSize', props<{ pageSize: number }>()); 



export const selectList = createAction("[items.list.templete] select list");
export const selectListSuccess = createAction("[items.list.templete] select list success", props<{ items: Item[], total: number }>());
export const selectListFailure = createAction("[items.list.templete] select list failure", props<{ error: any }>());

export const remove = createAction("[items.list.templete] remove", props<{ item: Item }>());
export const removeSuccess = createAction("[items.list.templete] remove success", props<{ item: Item }>());
export const removeFailure = createAction("[items.list.templete] remove failure", props<{ item: Item }>());



export const editItem = createAction("[items.list.templete] edit item", props<{ item: Item }>());
export const newItem = createAction("[items.list.templete] new item");


export const disableItem = createAction("[item/database] update statusId");
export const enableItem = createAction("[item/database] update statusId"); 

export const more = createAction("[items.list.templete] more", props<{ buttons: any[] }>());
export const showAttributeInput = createAction("[item/page] show attribute input");
export const addInventory = createAction("[inventory/presentation] add");
export const importInventories = createAction("[inventories/presentation] import");
export const exportInventories = createAction("[inventories/presentation] export");
export const printInventories = createAction("[inventories/presentation] print"); 


export const upload = createAction("[items.list.templete] upload", props<{ bstr: string }>());
export const uploadSuccess = createAction("[items.list.templete] upload success", props<{ items: Item[] }>());
export const uploadFailure = createAction("[items.list.templete] upload failure", props<{ error: any }>());