import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[workOrderEvent.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[workOrderEvent.edit.templete] create inventory", props<{ workOrderEventWithAttributes: any }>());
export const createSuccess = createAction("[workOrderEvent.edit.templete] create success", props<{ workOrderEvent: Inventory }>());
export const createFailure = createAction("[workOrderEvent.edit.templete] create failure", props<{ workOrderEvent: Inventory }>());
export const update = createAction("[workOrderEvent.edit.templete] update inventory", props<{ workOrderEventWithAttributes: any }>());
export const updateSuccess = createAction("[workOrderEvent.edit.templete] update success", props<{ workOrderEvent: Inventory }>());
export const updateFailure = createAction("[workOrderEvent.edit.templete] update failure", props<{ workOrderEvent: Inventory }>());

export const closePresentation = createAction("[workOrderEvent.edit.templete] close presentation");