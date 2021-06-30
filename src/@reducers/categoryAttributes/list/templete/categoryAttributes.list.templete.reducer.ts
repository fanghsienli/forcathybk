import { createReducer, on } from "@ngrx/store";
import {
    CategoryAttributesListTempleteActions,
    CategoryAttributeEditTempleteActions
} from "@actions/category";
import {
    CategoryViewPageActions
} from "@actions/category";
export const featureKey = "categoryAttributes.list.templete";

export interface State {
    loaded: boolean;
    loading: boolean;
    ids: string[];
    upsertId: string | null;
    removeId: string | null;
    anyLike: string;
    ownerId: string;
    orderBy: string;
    descending: boolean;
    pageSize: number;
}

const initialState: State = {
    loaded: false,
    loading: false,
    ids: [],
    upsertId: null,
    removeId: null,
    anyLike: "",
    ownerId: "",
    orderBy: "",
    descending: false,
    pageSize: 20
};


export const reducer = createReducer(
    initialState,
    on(CategoryViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            ownerId: id
        };
    }),
    on(CategoryAttributesListTempleteActions.select, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(CategoryAttributesListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(CategoryAttributesListTempleteActions.selectSuccess, (state, { categoryAttributes }) => {
        return {
            ...state,
            loading: false,
            ids: categoryAttributes.map(x => x.id),
            loaded: true
        };
    }),
    on(CategoryAttributeEditTempleteActions.createSuccess,
        CategoryAttributesListTempleteActions.removeFailure,
        CategoryAttributeEditTempleteActions.updateSuccess, (state, { categoryAttribute }) => {
            if (state.ids.indexOf(categoryAttribute.id) > -1) {
                return {
                    ...state,
                    upsertId: categoryAttribute.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, categoryAttribute.id],
                upsertId: categoryAttribute.id
            };
        }),
    on(CategoryAttributesListTempleteActions.removeSuccess,
        CategoryAttributeEditTempleteActions.createFailure, (state, { categoryAttribute }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== categoryAttribute.id),
                removeId: categoryAttribute.id
            });
        }),
    on(CategoryAttributesListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike, loaded: false
    })),
    on(CategoryAttributesListTempleteActions.selectError, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(CategoryAttributesListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        descending,
        loaded: false
    }))
);

export const getLoading = (state: State) => state.loading;
export const getAnyLike = (state: State) => state.anyLike;
export const getPageSize = (state: State) => state.pageSize;
export const getOrderBy = (state: State) => state.orderBy;
export const ids = (state: State) => state.ids;
export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const getOwnerId = (state: State) => state.ownerId;