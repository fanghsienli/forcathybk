import { createReducer, on } from "@ngrx/store";
import {
    CategoryViewPageActions
} from "@actions/category";
import {
    ItemsViewPageActions,
    ItemsListTempleteActions,
    ItemEditTempleteActions
} from "@actions/item";

export const featureKey = "items.list.templete";

export interface State {
    loaded: boolean;
    loading: boolean;
    ids: string[];
    upsertId: string | null;
    removeId: string | null;
    anyLike: string;
    categoryId: string;
    orderBy: string;
    descending: boolean;
    pageSize: number;
    pageIndex: number;
    total: number;
    uploadIds: string[];
    uploadTarget: any;
}

const initialState: State = {
    loaded: false,
    loading: false,
    ids: [],
    upsertId: null,
    removeId: null,
    anyLike: "",
    categoryId: "",
    orderBy: "",
    descending: false,
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    uploadIds: [],
    uploadTarget: null
};


export const reducer = createReducer(
    initialState,
    on(ItemsViewPageActions.setEmpty, () => initialState),
    on(CategoryViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            categoryId: id
        };
    }),
    on(ItemsListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(ItemsListTempleteActions.selectListSuccess, (state, { items, total }) => {
        return {
            ...state,
            loading: false,
            ids: items.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(ItemsListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ItemsListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(ItemsListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(ItemsListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(ItemsListTempleteActions.uploadSuccess, (state, { items }) => {
        return {
            ...state,
            uploadIds: items.map(x => x.id)
        };
    }),
    on(ItemEditTempleteActions.createSuccess,
        ItemEditTempleteActions.updateSuccess, (state, { item }) => {
            if (state.ids.indexOf(item.id) > -1) {
                return {
                    ...state,
                    upsertId: item.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, item.id],
                upsertId: item.id
            };
        }),
    on(ItemsListTempleteActions.removeSuccess,//InventoryEditTempleteActions.createFailure,
        (state, { item }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== item.id),
                removeId: item.id
            });
        }),
    on(ItemsListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike, loaded: false
    })),
    on(ItemsListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ItemsListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        descending, loaded: false
    }))
);
export const total = (state: State) => state.total;
export const loading = (state: State) => state.loading;
export const anyLike = (state: State) => state.anyLike;
export const pageSize = (state: State) => state.pageSize;
export const orderBy = (state: State) => state.orderBy;
export const ids = (state: State) => state.ids;
export const categoryId = (state: State) => state.categoryId;
export const upsertId = (state: State) => state.upsertId;
export const uploadIds = (state: State) => state.uploadIds;
export const removeId = (state: State) => state.removeId;