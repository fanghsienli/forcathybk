import { createReducer, on } from "@ngrx/store";
import { WorkPlanViewPageActions } from "@actions/workPlan";

export const featureKey = "workPlan.view.page";

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
    on(WorkPlanViewPageActions.setMode, (state, { mode }) => {
        return {
            ...state,
            mode: mode
        };
    }),
    on(WorkPlanViewPageActions.selectAttributesSuccess, (state, { attributes }) => {
        return {
            ...state,
            attributeIds: attributes.map(x=>x.id)
        };
    }),
    on(WorkPlanViewPageActions.putdown, (state, {  putdownCommand}) => {
        return {
            ...state,
            mode: "putdown",
            putdownCommand
        };
    }),
    on(WorkPlanViewPageActions.putdownOK, (state) => {
        return {
            ...state,
            mode: "",
            putdownCommand: ""
        };
    }),
    on(WorkPlanViewPageActions.find, (state, { id }) => {
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