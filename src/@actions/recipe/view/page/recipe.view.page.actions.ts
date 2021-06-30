import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";
import { Attribute } from "@entities/attribute";
export const setId = createAction("[recipe.view.page] set id", props<{ id: string }>());

export const find = createAction("[recipe.view.page] find");
export const findSuccess = createAction("[recipe.view.page] find success", props<{ recipe: Inventory }>());
export const findFailure = createAction("[recipe.view.page] find failure", props<{ error: string }>());


export const selectAttributes = createAction("[recipe.view.page] select attributes", props<{ itemId: string }>());
export const selectAttributesSuccess = createAction("[recipe.view.page] select attributes success", props<{ attributes: Attribute[] }>());
export const selectAttributesFailure = createAction("[recipe.view.page] select attributes failure", props<{ error: string }>());
export const disable = createAction("[recipe.view.page] disable", props<{ oldAction: string }>());
export const edit = createAction("[recipe.view.page] edit", props<{ id: string }>());
export const enable = createAction("[recipe.view.page] enable", props<{ id: string }>());
export const remove = createAction("[recipe.view.page] remove", props<{ id: string }>());

export const setMode = createAction("[recipe.view.page] set mode", props<{ mode: string }>());
export const more = createAction("[recipe.view.page] more", props<{ buttons: any[] }>());
export const addAttributeWithRecipe = createAction("[recipe.view.page] add recipeAttribute", props<{ ownerId: string }>());

export const addInventory = createAction("[recipe.view.page] add inventory", props<{ oldAction: string }>());
export const importInventories = createAction("[recipe.view.page] import inventories", props<{ oldAction: string }>());
export const exportInventories = createAction("[recipe.view.page] export inventories", props<{ oldAction: string }>());
export const printInventories = createAction("[recipe.view.page] print inventories", props<{ oldAction: string }>());

export const oldActionOk = createAction("[recipe.view.page] old action ok");