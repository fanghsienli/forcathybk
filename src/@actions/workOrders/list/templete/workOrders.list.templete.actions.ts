import { createAction, props } from "@ngrx/store"; 
import { Inventory } from "@entities/inventory";

export const create = createAction("[workOrders.list.templete] create", props<{ workOrder: Inventory }>());
export const createSuccess = createAction("[workOrders.list.templete] create success", props<{ workOrder: Inventory }>());
export const createFailure = createAction("[workOrders.list.templete] create failure", props<{ workOrder: Inventory }>());
export const update = createAction("[workOrders.list.templete] update", props<{ workOrder: Inventory }>());
export const updateSuccess = createAction("[workOrders.list.templete] update success", props<{ workOrder: Inventory }>());
export const updateFailure = createAction("[workOrders.list.templete] update failure", props<{ workOrder: Inventory }>());
export const setSort = createAction("[workOrders.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[workOrders.list.templete] set filter", props<{ anyLike: string }>());
export const setPageIndex = createAction('[workOrders.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[workOrders.list.templete] set pageSize', props<{ pageSize: number }>());

export const selectList = createAction("[workOrders.list.templete] select list");
export const selectListSuccess = createAction("[workOrders.list.templete] select list success", props<{ workOrders: Inventory[], total: number }>());
export const selectListFailure = createAction("[workOrders.list.templete] select list failure", props<{ error: any }>());

export const editWorkOrder = createAction("[workOrders.list.templete] edit workOrder", props<{ workOrder: Inventory }>());
export const newWorkOrder = createAction("[workOrders.list.templete] new workOrder");

export const exportOk = createAction("[workOrders.list.templete] export ok");

export const remove = createAction("[workOrders.list.templete] remove", props<{ workOrder: Inventory }>());
export const removeSuccess = createAction("[workOrders.list.templete] remove success", props<{ workOrder: Inventory }>());
export const removeFailure = createAction("[workOrders.list.templete] remove failure", props<{ workOrder: Inventory }>());


export const more = createAction("[inventories.list.templete] more", props<{ buttons: any[] }>());
export const setEmpty = createAction("[workOrders.list.templete] remove filter - all");

export const goToEdit = createAction("[workOrders.list.templete] go to edit", props<{ id: string }>());
export const goToEditOk = createAction("[workOrders.list.templete] go to edit ok");