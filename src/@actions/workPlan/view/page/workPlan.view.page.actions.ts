import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";
import { Attribute } from "@entities/attribute";
export const setId = createAction("[workPlan.view.page] set id", props<{ id: string }>());

export const find = createAction("[workPlan.view.page] find", props<{ id: string }>());
export const findSuccess = createAction("[workPlan.view.page] find success", props<{ workPlan: Inventory }>());
export const findFailure = createAction("[workPlan.view.page] find failure", props<{ error: string }>());


export const selectAttributes = createAction("[workPlan.view.page] select attributes", props<{ itemId: string }>());
export const selectAttributesSuccess = createAction("[workPlan.view.page] select attributes success", props<{ attributes: Attribute[] }>());
export const selectAttributesFailure = createAction("[workPlan.view.page] select attributes failure", props<{ error: string }>());
export const disable = createAction("[workPlan.view.page] disable", props<{ oldAction: string }>());
export const edit = createAction("[workPlan.view.page] edit", props<{ id: string }>());
export const enable = createAction("[workPlan.view.page] enable", props<{ id: string }>());


export const setMode = createAction("[workPlan.view.page] set mode", props<{ mode: string }>());
export const more = createAction("[workPlan.view.page] more", props<{ buttons: any[] }>());
export const addAttributeWithWorkPlan = createAction("[workPlan.view.page] add workPlanAttribute", props<{ ownerId: string }>());

export const addInventory = createAction("[workPlan.view.page] add inventory", props<{ oldAction: string }>());
export const importInventories = createAction("[workPlan.view.page] import inventories", props<{ oldAction: string }>());
export const exportInventories = createAction("[workPlan.view.page] export inventories", props<{ oldAction: string }>());
export const printInventories = createAction("[workPlan.view.page] print inventories", props<{ oldAction: string }>());

export const oldActionOk = createAction("[workPlan.view.page] old action ok");



export const putdown = createAction("[workPlan.view.page] putdown", props<{ putdownCommand: string }>());
export const putdownOK = createAction("[workPlan.view.page] putdown ok");


export const remove = createAction("[workPlan.view.page] remove", props<{ workPlan: Inventory }>());
export const removeSuccess = createAction("[workPlan.view.page] remove success", props<{ workPlan: Inventory }>());
export const removeFailure = createAction("[workPlan.view.page] remove failure", props<{ workPlan: Inventory }>());