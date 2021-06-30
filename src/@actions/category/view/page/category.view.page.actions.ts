import { createAction, props } from "@ngrx/store";
import { Category } from "@entities/category";

export const setId = createAction("[category.view.page] set id", props<{ id: string }>());
export const disableCategory = createAction("[category.view.page] disable");
export const enableCategory = createAction("[category.view.page] enable");
export const deleteCategory = createAction("[category.view.page] delete"); 

export const disable = createAction("[category.view.page] disable", props<{ oldAction: string }>());
export const edit = createAction("[category.view.page] edit", props<{ oldAction: string }>());
export const enable = createAction("[category.view.page] enable", props<{ oldAction: string }>());
export const remove = createAction("[category.view.page] remove", props<{ oldAction: string }>());
export const pickup = createAction("[category.view.page] pickup", props<{ pickup: Category, presentationAction: string }>()); 
export const pickupOk = createAction("[category.view.page] pickup ok"); 
export const oldActionOk = createAction("[category.view.page] old action ok");
export const addCategory = createAction("[category.view.page] add category", props<{ oldAction: string }>());
export const importCategories = createAction("[category.view.page] import categories", props<{ oldAction: string }>());
export const exportCategories = createAction("[category.view.page] export categories", props<{ oldAction: string }>());
export const printCategories = createAction("[category.view.page] print categories", props<{ oldAction: string }>());
export const find = createAction("[category.view.page] find", props<{ id: string }>());
export const findSuccess = createAction("[category.view.page] find success", props<{ category: Category }>());
export const findFailure = createAction("[category.view.page] find failure");


export const setMode = createAction("[category.view.page] set mode", props<{ mode: string }>());
export const more = createAction("[category.view.page] more", props<{ buttons: any[] }>());
export const showAttributeInput = createAction("[category.view.page] show attribute input");
export const view = createAction("[category.view.page] view"); 

