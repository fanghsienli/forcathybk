import { createReducer, on } from "@ngrx/store";
import {
    InventoryViewPageActions, InventoryEditTempleteActions 
} from "@actions/inventory";

import { InventoriesListTempleteActions } from "@actions/inventory";
import { Inventory } from "@entities/inventory";
import { ItemViewPageActions } from "@actions/item";
export const featureKey = "inventories.list.templete";

export interface State {
    id: string;
    inventory: Inventory;
    presentationAction: string;
    loaded: boolean;
    loading: boolean;
    ids: string[];
    attributeIds: string[];
    anyLike: string;
    orderBy: string;
    descending: boolean;
    pageIndex: number;
    pageSize: number;
    itemId: string | null;
    inventoryId: string | null;
    upsertId: string;
    removeId: string;
    total: number;
    exported: boolean;
    imported: boolean;
}

const initialState: State = {
    id: "",
    inventory: null,
    presentationAction: "",
    loaded: false,
    loading: false,
    attributeIds: [],
    ids: [],
    anyLike: "",
    orderBy: "positionStartDate",
    descending: true,
    pageIndex: 1,
    pageSize: 15,
    itemId: "",
    inventoryId: "",
    upsertId: null,
    removeId: null,
    total: 0,
    exported: true,
    imported: true
};


export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            itemId: id,
            inventoryId: null
        };
    }),
    on(InventoryViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            inventoryId: id,
            itemId: null
        };
    }),
    on(InventoryEditTempleteActions.createSuccess,
        InventoryEditTempleteActions.updateSuccess,
        InventoriesListTempleteActions.createSuccess,
        InventoriesListTempleteActions.updateSuccess,
        (state, { inventory }) => {            
            if (state.ids.indexOf(inventory.id) > -1) {
                return {
                    ...state,
                    upsertId: inventory.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, inventory.id],
                upsertId: inventory.id
            };
        }),
    on(InventoriesListTempleteActions.removeSuccess,//InventoryEditTempleteActions.createFailure,
        (state, { inventory }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== inventory.id),
                total: state.total-1,
                removeId: inventory.id
            });
        }),
    on(InventoriesListTempleteActions.pickup, (state, { inventory, presentationAction }) => {
        return {
            ...state,
            inventory,
            presentationAction
        };
    }),
    on(InventoryViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            categoryId: id
        };
    }), 
    on(InventoriesListTempleteActions.goToEdit, (state, { id }) => ({
        ...state,
        id: id
    })),
    on(InventoriesListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            itemId: id
        };
    }),
    on(InventoriesListTempleteActions.selectListSuccess, (state, { inventories, total }) => {
        return {
            ...state,
            loading: false,
            ids: inventories.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(InventoriesListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(InventoriesListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(InventoriesListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(InventoriesListTempleteActions.setFilter, (state, { anyLike, itemId }) => ({
        ...state,
        anyLike,
        itemId,
        pageIndex: 1,
        loaded: false
    })),    
    on(InventoriesListTempleteActions.exportList, (state) => ({
        ...state,
        exported:false
    })),   
    on(InventoriesListTempleteActions.exportListOk, (state) => ({
        ...state,
        exported: true
    })),
    on(InventoriesListTempleteActions.importList, (state) => ({
        ...state,
        imported: false
    })),
    on(InventoriesListTempleteActions.importListOk, (state) => ({
        ...state,
        imported: true
    })),   
    on(InventoriesListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        pageIndex: 1,
        loaded: false,
        descending
    }))
);

export const itemId = (state: State) => state.itemId;
export const inventoryId = (state: State) => state.inventoryId;
export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const ids = (state: State) => state.ids;
export const attributeIds = (state: State) => state.attributeIds;
export const orderBy = (state: State) => state.orderBy;
export const total = (state: State) => state.total;
export const exported = (state: State) => state.exported;
export const imported = (state: State) => state.imported;