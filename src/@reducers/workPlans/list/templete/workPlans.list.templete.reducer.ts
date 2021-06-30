import { createReducer, on } from "@ngrx/store";
import {
    WorkPlanViewPageActions, WorkPlanEditTempleteActions
} from "@actions/workPlan";

import { WorkPlansListTempleteActions } from "@actions/workPlan";
import { Inventory } from "@entities/inventory";
import { ItemViewPageActions } from "@actions/item";
export const featureKey = "workPlans.list.templete";

export interface State {
    id: string;
    workPlan: Inventory;
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
    workPlanId: string | null;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    id: "",
    workPlan: null,
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
    workPlanId: "",
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
            workPlanId: null
        };
    }),
    on(WorkPlansListTempleteActions.removeFailure,
        WorkPlanEditTempleteActions.createSuccess,
        WorkPlanEditTempleteActions.updateSuccess,
        (state, { workPlan }) => {
            if (state.ids.indexOf(workPlan.id) > -1) {
                return {
                    ...state,
                    upsertId: workPlan.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, workPlan.id],
                upsertId: workPlan.id
            };
    }),
    on(WorkPlansListTempleteActions.removeSuccess,//WorkPlanEditTempleteActions.createFailure,
        (state, { workPlan }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== workPlan.id),
                removeId: workPlan.id
            });
        }),
    on(WorkPlanViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            categoryId: id
        };
    }),
    on(WorkPlansListTempleteActions.goToEdit, (state, { id }) => ({
        ...state,
        id: id
    })),
    on(WorkPlansListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(WorkPlansListTempleteActions.selectListSuccess, (state, { workPlans, total }) => {
        return {
            ...state,
            loading: false,
            ids: workPlans.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(WorkPlansListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(WorkPlansListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(WorkPlansListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(WorkPlansListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(WorkPlansListTempleteActions.setSort, (state, { orderBy, descending }) => ({
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