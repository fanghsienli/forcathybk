import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory"; 

export const setConditions = createAction("[recipe.edit.templete] set attribute id", props<{ ownerId: string, attributeId: string }>());
export const create = createAction("[recipe.edit.templete] create inventory", props<{ recipeWithAttributes: any }>());
export const createSuccess = createAction("[recipe.edit.templete] create success", props<{ recipe: Inventory }>());
export const createFailure = createAction("[recipe.edit.templete] create failure", props<{ recipe: Inventory }>());
export const update = createAction("[recipe.edit.templete] update inventory", props<{ recipeWithAttributes: any }>());
export const updateSuccess = createAction("[recipe.edit.templete] update success", props<{ recipe: Inventory }>());
export const updateFailure = createAction("[recipe.edit.templete] update failure", props<{ recipe: Inventory }>());

export const closePresentation = createAction("[recipe.edit.templete] close presentation");