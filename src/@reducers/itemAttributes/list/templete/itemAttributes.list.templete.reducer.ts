import { createReducer, on } from "@ngrx/store";
import {
    ItemAttributesListTempleteActions,
    ItemAttributeEditTempleteActions
} from "@actions/item";
import {
    ItemViewPageActions
} from "@actions/item";
export const featureKey = "itemAttributes.list.templete";

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
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            ownerId: id
        };
    }),    
    on(ItemAttributesListTempleteActions.select, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(ItemAttributesListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(ItemAttributesListTempleteActions.selectSuccess, (state, { itemAttributes }) => {
        return {
            ...state,
            loading: false,
            ids: itemAttributes.map(x => x.id),
            loaded:true
        };
    }),
    on(ItemAttributeEditTempleteActions.createSuccess,
        ItemAttributesListTempleteActions.removeFailure,
        ItemAttributeEditTempleteActions.updateSuccess, (state, { itemAttribute }) => {
            if (state.ids.indexOf(itemAttribute.id) > -1) {
                return {
                    ...state,
                    upsertId: itemAttribute.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, itemAttribute.id],
                upsertId: itemAttribute.id
            };
        }), 
    on(ItemAttributesListTempleteActions.removeSuccess,
        ItemAttributeEditTempleteActions.createFailure, (state, { itemAttribute }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== itemAttribute.id),
                removeId: itemAttribute.id
            });
        }),
    on(ItemAttributesListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike, loaded: false
    })),
    on(ItemAttributesListTempleteActions.selectError, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ItemAttributesListTempleteActions.setSort, (state, { orderBy, descending }) => ({
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