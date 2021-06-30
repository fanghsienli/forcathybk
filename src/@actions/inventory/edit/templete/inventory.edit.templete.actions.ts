import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[inventory.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[inventory.edit.templete] create inventory", props<{ inventoryWithAttributes: any }>());
export const createSuccess = createAction("[inventory.edit.templete] create success", props<{ inventory: Inventory }>());
export const createFailure = createAction("[inventory.edit.templete] create failure", props<{ inventory: Inventory }>());
export const update = createAction("[inventory.edit.templete] update inventory", props<{ inventoryWithAttributes: any }>());
export const updateSuccess = createAction("[inventory.edit.templete] update success", props<{ inventory: Inventory }>());
export const updateFailure = createAction("[inventory.edit.templete] update failure", props<{ inventory: Inventory }>());

export const closePresentation = createAction("[inventory.edit.templete] close presentation");