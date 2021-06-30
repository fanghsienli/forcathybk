import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[workOrder.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[workOrder.edit.templete] create inventory", props<{ workOrderWithAttributes: any }>());
export const createSuccess = createAction("[workOrder.edit.templete] create success", props<{ workOrder: Inventory }>());
export const createFailure = createAction("[workOrder.edit.templete] create failure", props<{ workOrder: Inventory }>());
export const update = createAction("[workOrder.edit.templete] update inventory", props<{ workOrderWithAttributes: any }>());
export const updateSuccess = createAction("[workOrder.edit.templete] update success", props<{ workOrder: Inventory }>());
export const updateFailure = createAction("[workOrder.edit.templete] update failure", props<{ workOrder: Inventory }>());

export const closePresentation = createAction("[workOrder.edit.templete] close presentation");