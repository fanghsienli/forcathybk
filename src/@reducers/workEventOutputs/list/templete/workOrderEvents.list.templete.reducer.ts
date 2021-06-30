import { createReducer, on } from "@ngrx/store";
import { WorkOrderEventsListTempleteActions, WorkOrderEventEditTempleteActions } from "@actions/workOrder";
import { Attribute } from "@entities/attribute";
export const featureKey = "workOrderEvents.list.templete";

export interface State {
    id: string;
    presentationAction: string;
    loaded: boolean;
    loading: boolean;
    ids: string[];
    anyLike: string | null;
    orderBy: string;
    descending: boolean;
    pageIndex: number;
    pageSize: number;
    ownerId: string;
    attribute: Attribute,
    attributeId: string;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    id: "",  
    presentationAction: "",
    loaded: false,
    loading: false,
    ids: [],
    anyLike: "",
    orderBy: "",
    descending: false,
    pageIndex: 1,
    pageSize: 15,
    ownerId: "",
    attribute:null,
    attributeId: "",
    upsertId: null,
    removeId: null,
    total: 0
};


export const reducer = createReducer(
    initialState,
    on(WorkOrderEventsListTempleteActions.setConditions, (state, { ownerId, attributeId }) => {
        return {
            ...state,
            ownerId,
            attributeId
        };
    }),
    on(WorkOrderEventsListTempleteActions.setAttribute, (state, { attribute }) => {
        return {
            ...state,
            attribute
        };
    }),
    on(
        WorkOrderEventsListTempleteActions.removeFailure,
        WorkOrderEventEditTempleteActions.createSuccess,
        WorkOrderEventEditTempleteActions.updateSuccess,
        (state, { workOrderEvent }) => {
            if (state.ids.indexOf(workOrderEvent.id) > -1) {
                return {
                    ...state,
                    upsertId: workOrderEvent.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, workOrderEvent.id],
                upsertId: workOrderEvent.id
            };
        }),
    on(WorkOrderEventsListTempleteActions.removeSuccess,//WorkOrderEventEditTempleteActions.createFailure,
        (state, { workOrderEvent }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== workOrderEvent.id),
                removeId: workOrderEvent.id
            });
        }),  
    on(WorkOrderEventsListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(WorkOrderEventsListTempleteActions.selectListSuccess, (state, { workOrderEvents, total }) => {
        return {
            ...state,
            loading: false,
            ids: workOrderEvents.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(WorkOrderEventsListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(WorkOrderEventsListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(WorkOrderEventsListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(WorkOrderEventsListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(WorkOrderEventsListTempleteActions.setConditions, (state, { attributeId,ownerId   }) => ({
        ...state,
        attributeId,
        ownerId,
        loaded: false
    })),    
    on(WorkOrderEventsListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        pageIndex: 1,
        loaded: false,
        descending
    }))
);


export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const ids = (state: State) => state.ids;
export const orderBy = (state: State) => state.orderBy;
export const total = (state: State) => state.total;