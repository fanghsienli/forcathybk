import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";
import { Attribute } from "@entities/attribute";
export const setId = createAction("[workOrder.view.page] set id", props<{ id: string }>());

export const find = createAction("[workOrder.view.page] find", props<{ id: string }>());
export const findSuccess = createAction("[workOrder.view.page] find success", props<{ workOrder: Inventory }>());
export const findFailure = createAction("[workOrder.view.page] find failure", props<{ error: string }>());


export const selectAttributes = createAction("[workOrder.view.page] select attributes", props<{ itemId: string }>());
export const selectAttributesSuccess = createAction("[workOrder.view.page] select attributes success", props<{ attributes: Attribute[] }>());
export const selectAttributesFailure = createAction("[workOrder.view.page] select attributes failure", props<{ error: string }>());
export const disable = createAction("[workOrder.view.page] disable", props<{ oldAction: string }>());
export const edit = createAction("[workOrder.view.page] edit", props<{ id: string }>());
export const enable = createAction("[workOrder.view.page] enable", props<{ id: string }>());


export const setMode = createAction("[workOrder.view.page] set mode", props<{ mode: string }>());
export const more = createAction("[workOrder.view.page] more", props<{ buttons: any[] }>());
export const addAttributeWithWorkOrder = createAction("[workOrder.view.page] add workOrderAttribute", props<{ ownerId: string }>());

export const addInventory = createAction("[workOrder.view.page] add inventory", props<{ oldAction: string }>());
export const importInventories = createAction("[workOrder.view.page] import inventories", props<{ oldAction: string }>());
export const exportInventories = createAction("[workOrder.view.page] export inventories", props<{ oldAction: string }>());
export const printInventories = createAction("[workOrder.view.page] print inventories", props<{ oldAction: string }>());

export const oldActionOk = createAction("[workOrder.view.page] old action ok");



export const putdown = createAction("[workOrder.view.page] putdown", props<{ putdownCommand: string }>());
export const putdownOK = createAction("[workOrder.view.page] putdown ok");


export const remove = createAction("[workOrder.view.page] remove", props<{ workOrder: Inventory }>());
export const removeSuccess = createAction("[workOrder.view.page] remove success", props<{ workOrder: Inventory }>());
export const removeFailure = createAction("[workOrder.view.page] remove failure", props<{ workOrder: Inventory }>());