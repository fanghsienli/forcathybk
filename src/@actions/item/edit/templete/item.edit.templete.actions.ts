import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";




export const create = createAction("[item.edit.templete] create", props<{ item: Item }>());
export const createSuccess = createAction("[item.edit.templete] create success", props<{ item: Item }>());
export const createFailure = createAction("[item.edit.templete] create failure", props<{ item: Item }>());
export const closePresentation = createAction("[item.edit.templete] close presentation");





export const update = createAction("[item.edit.templete] update", props<{ item: Item }>());
export const updateSuccess = createAction("[item.edit.templete] update success", props<{ item: Item }>());
export const updateFailure = createAction("[item.edit.templete] update failure", props<{ item: Item }>());