import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[relationshipTarget.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[relationshipTarget.edit.templete] create inventory", props<{ relationshipTargetWithAttributes: any }>());
export const createSuccess = createAction("[relationshipTarget.edit.templete] create success", props<{ relationshipTarget: Inventory }>());
export const createFailure = createAction("[relationshipTarget.edit.templete] create failure", props<{ relationshipTarget: Inventory }>());
export const update = createAction("[relationshipTarget.edit.templete] update inventory", props<{ relationshipTargetWithAttributes: any }>());
export const updateSuccess = createAction("[relationshipTarget.edit.templete] update success", props<{ relationshipTarget: Inventory }>());
export const updateFailure = createAction("[relationshipTarget.edit.templete] update failure", props<{ relationshipTarget: Inventory }>());

export const closePresentation = createAction("[relationshipTarget.edit.templete] close presentation");