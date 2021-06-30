import { createReducer, on } from "@ngrx/store";
import { WorkOrderViewPageActions } from "@actions/workOrder";

export const featureKey = "workOrder.view.page";

export interface State {
    loading: boolean;
    mode: string;
    selectedAttributeId: string;
    upsertId: string;
    putdownCommand: string; 
}

const initialState: State = {
    loading: false,
    mode: "station",
    selectedAttributeId: "",
    upsertId: "",
    putdownCommand: ""
};


export const reducer = createReducer(
    initialState,
    on(WorkOrderViewPageActions.setMode, (state, { mode }) => {
        return {
            ...state,
            mode: mode
        };
    }),
    on(WorkOrderViewPageActions.selectAttributesSuccess, (state, { attributes }) => {
        return {
            ...state,
            attributeIds: attributes.map(x=>x.id)
        };
    }),
    on(WorkOrderViewPageActions.putdown, (state, {  putdownCommand}) => {
        return {
            ...state,
            mode: "putdown",
            putdownCommand
        };
    }),
    on(WorkOrderViewPageActions.putdownOK, (state) => {
        return {
            ...state,
            mode: "",
            putdownCommand: ""
        };
    }),
    on(WorkOrderViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            upsertId: id
        };
    })
);

export const putdownCommand = (state: State) => state.putdownCommand;
export const upsertId = (state: State) => state.upsertId;
export const loading = (state: State) => state.loading;
export const mode = (state: State) => state.mode;