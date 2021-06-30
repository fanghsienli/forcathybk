import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";
import { Inventory } from "@entities/inventory";

export const remove = createAction("[item.view.page] remove", props<{ item: Item }>());

export const more = createAction("[item.view.page] more", props<{ buttons: any[] }>());
export const editDefault = createAction("[item.view.page] edit default", props<{ buttons: any[] }>());
export const addRecipe = createAction("[item.view.page] add recipe", props<{ buttons: any[] }>());
export const editItem = createAction("[items.view.page] edit item", props<{ item: Item }>());

export const createRecipe = createAction("[item.edit.page] create recipe", props<{ item: Item }>());
export const createRecipeSuccess = createAction("[item.edit.page] create recipe success", props<{ recipe: Inventory }>());
export const createRecipeFailure = createAction("[item.edit.page] create recipe failure"); 



export const addAttributeWithItem = createAction("[item.view.page] add itemAttribute", props<{ ownerId: string }>()); 
export const printInventories = createAction("[item.view.page] print inventories", props<{ item: Item }>());
export const printInventoriesOk = createAction("[item.view.page] print inventories ok");

export const find = createAction("[item.view.page] find", props<{ id: string }>());
export const findSuccess = createAction("[item.view.page] find success", props<{ item: Item }>());
export const findFailure = createAction("[item.view.page] find failure");
 