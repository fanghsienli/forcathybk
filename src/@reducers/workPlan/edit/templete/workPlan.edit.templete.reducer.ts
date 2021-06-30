import { createReducer, on } from "@ngrx/store";
import { WorkPlanEditTempleteActions, WorkPlansListTempleteActions } from "@actions/workPlan";
import { Inventory, InventoryAttribute } from "@entities/inventory";

export const featureKey = "workPlan.edit.templete";

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
    workPlanIds: string;
    categoryIds: string;
    workPlan: Inventory;
    workPlanWithAttributes: any;
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
    workPlanIds: "",
    categoryIds: "",
    workPlan: null,
    workPlanWithAttributes: null
};


export const reducer = createReducer(
    initialState,
    on(WorkPlanEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
    on(WorkPlansListTempleteActions.editWorkPlan, (state, { workPlan }) => {
        return {
            ...state,
            workPlan
        };
    }),
    on(WorkPlansListTempleteActions.newWorkPlan, (state) => {
        return {
            ...state,
            workPlan: null
        };
    }),
    on(WorkPlanEditTempleteActions.create, (state, { workPlanWithAttributes }) => {
        return {
            ...state,
            workPlanWithAttributes
        };
    }),
    on(WorkPlanEditTempleteActions.update, (state, { workPlanWithAttributes }) => {
        return {
            ...state,
            workPlanWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const workPlan = (state: State) => state.workPlan;