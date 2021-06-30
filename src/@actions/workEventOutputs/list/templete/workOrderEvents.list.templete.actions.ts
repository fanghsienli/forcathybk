import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";
import { Attribute } from "@entities/attribute";
import { Item } from "@entities/item";

export const more = createAction("[workOrderEvents.list.templete] more", props<{ buttons: any[] }>());
export const newWorkOrderEvent = createAction("[workOrderEvents.list.templete] new workOrderEvent");
export const editWorkOrderEvent = createAction("[workOrderEvents.list.templete] edit workOrderEvent", props<{ workOrderEvent: Inventory }>());

export const setSort = createAction("[workOrderEvents.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[workOrderEvents.list.templete] set filter", props<{ anyLike: string }>());
export const setConditions = createAction("[workOrderEvents.list.templete] set conditions", props<{ ownerId: string, attributeId: string }>());
export const setAttribute = createAction("[workOrderEvents.list.templete] set attribute", props<{ attribute: Attribute }>());
export const setPageIndex = createAction('[workOrderEvents.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[workOrderEvents.list.templete] set pageSize', props<{ pageSize: number }>());

export const selectList = createAction("[workOrderEvents.list.templete] select list");
export const selectListSuccess = createAction("[workOrderEvents.list.templete] select list success", props<{ workOrderEvents: Inventory[], total: number }>());
export const selectListFailure = createAction("[workOrderEvents.list.templete] select list failure", props<{ error: any }>());

export const remove = createAction("[workOrderEvents.list.templete] remove", props<{ workOrderEvent: Inventory }>());
export const removeSuccess = createAction("[workOrderEvents.list.templete] remove success", props<{ workOrderEvent: Inventory }>());
export const removeFailure = createAction("[workOrderEvents.list.templete] remove failure", props<{ workOrderEvent: Inventory }>());


export const startStation = createAction("[workOrderEvents.list.templete] start station", props<{ station: Inventory, workOrder: Inventory }>());
export const pauseStation = createAction("[workOrderEvents.list.templete] pause station", props<{ station: Inventory, workOrder: Inventory }>());
export const resumeStation = createAction("[workOrderEvents.list.templete] resume station", props<{ station: Inventory, workOrder: Inventory }>());
export const stopStation = createAction("[workOrderEvents.list.templete] end station", props<{ station: Inventory, workOrder: Inventory }>());
export const pickup = createAction("[workOrderEvents.list.templete] pickup", props<{ limit: number, item: Item,workOrder:Inventory  }>());
export const startup = createAction("[workOrderEvents.list.templete] startup", props<{ limit: number, item: Item, workOrder: Inventory }>());
export const inspection = createAction("[workOrderEvents.list.templete] inspection", props<{ item: Item, workOrder: Inventory }>());