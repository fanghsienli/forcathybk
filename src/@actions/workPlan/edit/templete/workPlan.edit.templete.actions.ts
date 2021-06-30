import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[workPlan.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[workPlan.edit.templete] create inventory", props<{ workPlanWithAttributes: any }>());
export const createSuccess = createAction("[workPlan.edit.templete] create success", props<{ workPlan: Inventory }>());
export const createFailure = createAction("[workPlan.edit.templete] create failure", props<{ workPlan: Inventory }>());
export const update = createAction("[workPlan.edit.templete] update inventory", props<{ workPlanWithAttributes: any }>());
export const updateSuccess = createAction("[workPlan.edit.templete] update success", props<{ workPlan: Inventory }>());
export const updateFailure = createAction("[workPlan.edit.templete] update failure", props<{ workPlan: Inventory }>());

export const closePresentation = createAction("[workPlan.edit.templete] close presentation");