import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";

export const setId = createAction("[inventory.view.page] set id", props<{ id: string }>());
export const disableInventory = createAction("[inventory.view.page] disable");
export const enableInventory = createAction("[inventory.view.page] enable");
export const deleteInventory = createAction("[inventory.view.page] delete"); 

export const disable = createAction("[inventory.view.page] disable", props<{ oldAction: string }>());
export const edit = createAction("[inventory.view.page] edit", props<{ oldAction: string }>());
export const enable = createAction("[inventory.view.page] enable", props<{ oldAction: string }>());
export const remove = createAction("[inventory.view.page] remove", props<{ inventory: Inventory }>());
export const removeSuccess = createAction("[inventory.view.page] remove success", props<{ inventory: Inventory }>());
export const removeFailure = createAction("[inventory.view.page] remove failure", props<{ inventory: Inventory }>());
export const pickup = createAction("[inventory.view.page] pickup", props<{ pickup: Inventory, presentationAction: string }>()); 
export const pickupOk = createAction("[inventory.view.page] pickup ok"); 
export const addInventory = createAction("[inventory.view.page] add inventory", props<{ oldAction: string }>());
export const importInventories = createAction("[inventory.view.page] import inventories", props<{ oldAction: string }>());
export const exportInventories = createAction("[inventory.view.page] export inventories", props<{ oldAction: string }>());
export const printInventories = createAction("[inventory.view.page] print inventories", props<{ inventory: Inventory }>()); 
export const printInventoriesOk = createAction("[inventory.view.page] print inventories ok");


export const setMode = createAction("[inventory.view.page] set mode", props<{ mode: string }>());
export const more = createAction("[inventory.view.page] more", props<{ buttons: any[] }>());
export const showAttributeInput = createAction("[inventory.view.page] show attribute input");
export const view = createAction("[inventory.view.page] view"); 

