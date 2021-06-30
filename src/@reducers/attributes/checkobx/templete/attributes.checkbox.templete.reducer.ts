import { createReducer, on } from "@ngrx/store";
import { AttributesCheckboxTempleteActions } from "@actions/attribute";
import { ItemViewPageActions } from "@actions/item";
import { InventoryViewPageActions } from "@actions/inventory";
export const featureKey = "attributes.checkbox.templete";

export interface State {
    values: string[];
    itemId: string;
    inventoryId: string;
    categoryId: string;
    ids: string[];
    anyLike: string;
    selectedIds: string[];
}

const initialState: State = {
    values: [],
    itemId: "",
    inventoryId: "",
    categoryId:"",
    ids: [],
    anyLike:"",
    selectedIds:[]
};

export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            itemId: id, 
            loaded: false
        };
    }),
    on(InventoryViewPageActions.setId, (state) => {
        return {
            ...state,
            itemId: null
        };
    }),
    on(AttributesCheckboxTempleteActions.selectCheckbox, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(AttributesCheckboxTempleteActions.selectCheckboxSuccess, (state, { ids }) => {
        return {
            ...state,
            loading: false,
            ids,
            loaded: true
        };
    }),
    on(AttributesCheckboxTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike, 
        loaded: false
    })),
    on(AttributesCheckboxTempleteActions.setCategoryId, (state, { categoryId }) => ({
        ...state,
        categoryId,
        loaded: false
    })),
    on(AttributesCheckboxTempleteActions.setInventoryId, (state, { inventoryId }) => ({
        ...state,
        inventoryId,
        loaded: false
    })), 
    on(AttributesCheckboxTempleteActions.selectCheckboxError, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(AttributesCheckboxTempleteActions.setSelectedIds, (state, { selectedIds }) => ({
        ...state,
        selectedIds
    }))
);

export const itemId = (state: State) => state.itemId;
export const selectedIds = (state: State) => state.selectedIds;
export const ids = (state: State) => state.ids;