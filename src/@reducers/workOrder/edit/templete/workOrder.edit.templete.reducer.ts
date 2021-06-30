import { createReducer, on } from "@ngrx/store";
import { WorkOrderEditTempleteActions, WorkOrdersListTempleteActions } from "@actions/workOrder";
import { Inventory, InventoryAttribute } from "@entities/inventory";

export const featureKey = "workOrder.edit.templete";

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
    workOrderIds: string;
    categoryIds: string;
    workOrder: Inventory;
    workOrderWithAttributes: any;
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
    workOrderIds: "",
    categoryIds: "",
    workOrder: null,
    workOrderWithAttributes: null
};


export const reducer = createReducer(
    initialState,
    on(WorkOrderEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
    on(WorkOrdersListTempleteActions.editWorkOrder, (state, { workOrder }) => {
        return {
            ...state,
            workOrder
        };
    }),
    on(WorkOrdersListTempleteActions.newWorkOrder, (state) => {
        return {
            ...state,
            workOrder: null
        };
    }),
    on(WorkOrderEditTempleteActions.create, (state, { workOrderWithAttributes }) => {
        return {
            ...state,
            workOrderWithAttributes
        };
    }),
    on(WorkOrderEditTempleteActions.update, (state, { workOrderWithAttributes }) => {
        return {
            ...state,
            workOrderWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const workOrder = (state: State) => state.workOrder;