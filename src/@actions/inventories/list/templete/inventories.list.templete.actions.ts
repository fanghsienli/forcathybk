import { createAction, props } from "@ngrx/store";
import { Inventory, Position } from "@entities/inventory";
import { Item } from "@entities/item";
export const create = createAction("[inventories.list.templete] create inventory", props<{ inventory: Inventory }>());
export const createSuccess = createAction("[inventories.list.templete] create success", props<{ inventory: Inventory }>());
export const createFailure = createAction("[inventories.list.templete] create failure", props<{ inventory: Inventory }>());
export const update = createAction("[inventories.list.templete] update inventory", props<{ inventory: Inventory }>());
export const updateSuccess = createAction("[inventories.list.templete] update success", props<{ inventory: Inventory }>());
export const updateFailure = createAction("[inventories.list.templete] update failure", props<{ inventory: Inventory }>());
export const setSort = createAction("[inventories.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[inventories.list.templete] set filter", props<{ anyLike: string, itemId: string }>());
export const setPageIndex = createAction('[inventories.list.templete] set pageIndex', props<{ pageIndex: number }>()); 
export const setPageSize = createAction('[inventories.list.templete] set pageSize', props<{ pageSize: number }>()); 

export const printList = createAction("[inventories.list.templete] print list");
export const exportList = createAction("[inventories.list.templete] export list");
export const exportListOk = createAction("[inventories.list.templete] export list ok");
export const selectList = createAction("[inventories.list.templete] select list");
export const selectListSuccess = createAction("[inventories.list.templete] select list success", props<{ inventories: Inventory[],total:number }>());
export const selectListFailure = createAction("[inventories.list.templete] select list failure", props<{ error: any }>());

export const pickup = createAction("[inventories.list.templete] pickup", props<{ inventory: Inventory, presentationAction: string }>());
export const pickupOk = createAction("[inventories.list.templete] pickup ok");

export const exportOk = createAction("[inventories.list.templete] export ok");

export const remove = createAction("[inventories.list.templete] remove", props<{ inventory: Inventory }>());
export const removeSuccess = createAction("[inventories.list.templete] remove success", props<{ inventory: Inventory }>());
export const removeFailure = createAction("[inventories.list.templete] remove failure", props<{ inventory: Inventory }>());
export const importList = createAction("[inventories.list.templete] import list"); 
export const importListOk = createAction("[inventories.list.templete] import list ok"); 
export const newInventory = createAction("[inventories.list.templete] new inventory", props<{ item: Item, positionTarget: Inventory }>());
export const editInventory = createAction("[inventories.list.templete] edit inventory", props<{ inventory: Inventory }>());
export const more = createAction("[inventories.list.templete] more", props<{ buttons: any[] }>());
export const setEmpty = createAction("[inventories.list.templete] remove filter - all");

export const goToEdit = createAction("[inventories.list.templete] go to edit", props<{ id: string }>());
export const goToEditOk = createAction("[inventories.list.templete] go to edit ok");