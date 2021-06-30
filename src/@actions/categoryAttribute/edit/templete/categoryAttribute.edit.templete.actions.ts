import { createAction, props } from "@ngrx/store";
import { CategoryAttribute } from "@entities/category";
import { Attribute } from "@entities/attribute";
export const create = createAction("[categoryAttribute.edit.templete] create", props<{ categoryAttribute: CategoryAttribute }>());
export const createSuccess = createAction("[categoryAttribute.edit.templete] create success", props<{ categoryAttribute: CategoryAttribute }>());
export const createFailure = createAction("[categoryAttribute.edit.templete] create failure", props<{ categoryAttribute: CategoryAttribute }>());
export const closePresentation = createAction("[categoryAttribute.edit.templete] close presentation");




export const update = createAction("[categoryAttribute.edit.templete] update", props<{ categoryAttribute: CategoryAttribute }>());
export const updateSuccess = createAction("[categoryAttribute.edit.templete] update success", props<{ categoryAttribute: CategoryAttribute }>());
export const updateFailure = createAction("[categoryAttribute.edit.templete] update failure", props<{ categoryAttribute: CategoryAttribute }>());
