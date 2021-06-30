import { createAction, props } from "@ngrx/store";
import { InventoryAttribute } from "@entities/inventory";
export const create = createAction("[inventoryAttribute.edit.templete] create", props<{ inventoryAttribute: InventoryAttribute }>());
export const createSuccess = createAction("[inventoryAttribute.edit.templete] create success", props<{ inventoryAttribute: InventoryAttribute }>());
export const createFailure = createAction("[inventoryAttribute.edit.templete] create failure", props<{ inventoryAttribute: InventoryAttribute }>());
export const closePresentation = createAction("[inventoryAttribute.edit.templete] close presentation");
export const update = createAction("[inventoryAttribute.edit.templete] update", props<{ inventoryAttribute: InventoryAttribute }>());
export const updateSuccess = createAction("[inventoryAttribute.edit.templete] update success", props<{ inventoryAttribute: InventoryAttribute }>());
export const updateFailure = createAction("[inventoryAttribute.edit.templete] update failure", props<{ inventoryAttribute: InventoryAttribute }>());
