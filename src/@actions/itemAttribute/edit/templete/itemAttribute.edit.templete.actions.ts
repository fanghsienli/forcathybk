import { createAction, props } from "@ngrx/store";
import { ItemAttribute } from "@entities/item";
import { Attribute } from "@entities/attribute";
export const create = createAction("[itemAttribute.edit.templete] create", props<{ itemAttribute: ItemAttribute }>());
export const createSuccess = createAction("[itemAttribute.edit.templete] create success", props<{ itemAttribute: ItemAttribute }>());
export const createFailure = createAction("[itemAttribute.edit.templete] create failure", props<{ itemAttribute: ItemAttribute }>());
export const closePresentation = createAction("[itemAttribute.edit.templete] close presentation");




export const update = createAction("[itemAttribute.edit.templete] update", props<{ itemAttribute: ItemAttribute }>());
export const updateSuccess = createAction("[itemAttribute.edit.templete] update success", props<{ itemAttribute: ItemAttribute }>());
export const updateFailure = createAction("[itemAttribute.edit.templete] update failure", props<{ itemAttribute: ItemAttribute }>());
