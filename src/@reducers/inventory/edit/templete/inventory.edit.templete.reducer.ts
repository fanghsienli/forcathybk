import { createReducer, on } from "@ngrx/store";
import { InventoryEditTempleteActions, InventoriesListTempleteActions } from "@actions/inventory";
import { Inventory } from "@entities/inventory";
import { Item } from "@entities/item";

export const featureKey = "inventory.edit.templete";

export interface State {
    targetValue: string;
    attributeId: string;
    ownerId: string;
    must: boolean;
    id: string;
    level: number;
    valueType: string;
    valueNumber: number;
    itemIds: string;
    inventoryIds: string;
    categoryIds: string;
    inventory: Inventory;
    inventoryWithAttributes: any;
    item: Item;
    positionTarget: Inventory;
}

const initialState: State = {
    targetValue: "",
    attributeId: "",
    ownerId: "",
    must: false,
    id: "",
    level: 1,
    valueType: "",
    valueNumber: 1,
    itemIds: "",
    inventoryIds: "",
    categoryIds: "",
    inventory: null,
    inventoryWithAttributes: null,
    item: null,
    positionTarget: null
};


export const reducer = createReducer(
    initialState,
    on(InventoryEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
    on(InventoriesListTempleteActions.editInventory, (state, { inventory }) => {
        return {
            ...state,
            inventory
        };
    }),
    on(InventoriesListTempleteActions.newInventory, (state, { item, positionTarget }) => {
        return {
            ...state,
            inventory: null,
            item,
            positionTarget
        };
    }),
    on(InventoryEditTempleteActions.create, (state, { inventoryWithAttributes }) => {
        return {
            ...state,
            inventoryWithAttributes
        };
    }),
    on(InventoryEditTempleteActions.update, (state, { inventoryWithAttributes }) => {
        return {
            ...state,
            inventoryWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const inventory = (state: State) => state.inventory;
export const item = (state: State) => state.item;
export const positionTarget = (state: State) => state.positionTarget;