import { createReducer, on } from "@ngrx/store";
import { WorkOrderEventEditTempleteActions, WorkOrderEventsListTempleteActions } from "@actions/workOrder";
import { Inventory, InventoryAttribute } from "@entities/inventory";

export const featureKey = "workOrderEvent.edit.templete";

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
    workOrderEventIds: string;
    categoryIds: string;
    workOrderEvent: Inventory;
    workOrderEventWithAttributes: any;
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
    workOrderEventIds: "",
    categoryIds: "",
    workOrderEvent: null,
    workOrderEventWithAttributes: null
};


export const reducer = createReducer(
    initialState,
    on(WorkOrderEventEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
    on(WorkOrderEventsListTempleteActions.editWorkOrderEvent, (state, { workOrderEvent }) => {
        return {
            ...state,
            workOrderEvent
        };
    }),
    on(WorkOrderEventsListTempleteActions.newWorkOrderEvent, (state) => {
        return {
            ...state,
            workOrderEvent: null
        };
    }),
    on(WorkOrderEventEditTempleteActions.create, (state, { workOrderEventWithAttributes }) => {
        return {
            ...state,
            workOrderEventWithAttributes
        };
    }),
    on(WorkOrderEventEditTempleteActions.update, (state, { workOrderEventWithAttributes }) => {
        return {
            ...state,
            workOrderEventWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const workOrderEvent = (state: State) => state.workOrderEvent;