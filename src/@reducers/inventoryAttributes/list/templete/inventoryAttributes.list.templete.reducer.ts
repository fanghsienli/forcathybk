import { createReducer, on } from "@ngrx/store";
import {
    InventoryAttributesListTempleteActions,
    InventoryViewPageActions
} from "@actions/inventory";
export const featureKey = "inventoryAttributes.list.templete";

export interface State {
    loaded: boolean;
    loading: boolean;
    ids: string[];
    anyLike: string;
    inventoryId: string;
    orderBy: string;
    descending: boolean;
    pageSize: number;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    loaded: false,
    loading: false,
    ids: [],
    anyLike: "",
    inventoryId: "",
    orderBy: "",
    descending: false,
    pageSize: 20,
    upsertId: "",
    removeId: "",
    total:0
};

export const reducer = createReducer(
    initialState,
    on(InventoryViewPageActions.setId, (state, { id }) => {
        return {
            ...state, 
            inventoryId: id
        };
    }),
    on(InventoryAttributesListTempleteActions.get, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(InventoryAttributesListTempleteActions.getOk, (state) => {
        return {
            ...state,
            loading: false,
            error: ""
        };
    }),
    on(InventoryAttributesListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(InventoryAttributesListTempleteActions.setIds, (state, { ids }) => {
        return ({
            ...state,
            ids,
            loaded: true,
            error: ""
        });
    }), 
    on(InventoryAttributesListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike, loaded:false
    })),
    on(InventoryAttributesListTempleteActions.getError, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(InventoryAttributesListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        descending, loaded: false
    }))
);

export const getLoading = (state: State) => state.loading;
export const getAnyLike = (state: State) => state.anyLike; 
export const getPageSize = (state: State) => state.pageSize;
export const getOrderBy = (state: State) => state.orderBy;
export const ids = (state: State) => state.ids;
export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const getInventoryId = (state: State) => state.inventoryId;