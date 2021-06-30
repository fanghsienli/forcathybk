import { createReducer, on } from "@ngrx/store";
import {
    WorkOrderViewPageActions, WorkOrderEditTempleteActions
} from "@actions/workOrder";

import { WorkOrdersListTempleteActions } from "@actions/workOrder";
import { Inventory } from "@entities/inventory";
import { ItemViewPageActions } from "@actions/item";
export const featureKey = "workOrders.list.templete";

export interface State {
    id: string;
    workOrder: Inventory;
    presentationAction: string;
    loaded: boolean;
    loading: boolean;
    ids: string[];
    anyLike: string;
    orderBy: string;
    descending: boolean;
    pageIndex: number;
    pageSize: number;
    itemId: string | null;
    workOrderId: string | null;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    id: "",
    workOrder: null,
    presentationAction: "",
    loaded: false,
    loading: false,
    ids: [],
    anyLike: "",
    orderBy: "",
    descending: false,
    pageIndex: 1,
    pageSize: 15,
    itemId: "",
    workOrderId: "",
    upsertId: null,
    removeId: null,
    total: 0
};


export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            itemId: id,
            workOrderId: null
        };
    }),
    on(WorkOrdersListTempleteActions.removeFailure,
        WorkOrderEditTempleteActions.createSuccess,
        WorkOrderEditTempleteActions.updateSuccess,
        (state, { workOrder }) => {
            if (state.ids.indexOf(workOrder.id) > -1) {
                return {
                    ...state,
                    upsertId: workOrder.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, workOrder.id],
                upsertId: workOrder.id
            };
    }),
    on(WorkOrdersListTempleteActions.removeSuccess,//WorkOrderEditTempleteActions.createFailure,
        (state, { workOrder }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== workOrder.id),
                removeId: workOrder.id
            });
        }),
    on(WorkOrderViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            categoryId: id
        };
    }),
    on(WorkOrdersListTempleteActions.goToEdit, (state, { id }) => ({
        ...state,
        id: id
    })),
    on(WorkOrdersListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(WorkOrdersListTempleteActions.selectListSuccess, (state, { workOrders, total }) => {
        return {
            ...state,
            loading: false,
            ids: workOrders.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(WorkOrdersListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(WorkOrdersListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(WorkOrdersListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(WorkOrdersListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(WorkOrdersListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        pageIndex: 1,
        loaded: false,
        descending
    }))
);

export const getLoading = (state: State) => state.loading;
export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const ids = (state: State) => state.ids;
export const orderBy = (state: State) => state.orderBy;
export const total = (state: State) => state.total;