import { createReducer, on } from "@ngrx/store";
import { ItemViewPageActions, ItemEditTempleteActions } from "@actions/item";

export const featureKey = "item.view.page";

export interface State {
    loading: boolean;
    mode: string;
    oldAction: string;
    id: string;
    upsertId: string;
}

const initialState: State = {
    loading: false,
    mode: "",
    oldAction: "",
    id: "",
    upsertId: ""
};


export const reducer = createReducer(
    initialState,
    on(
        ItemViewPageActions.find,
        ItemEditTempleteActions.create,
        ItemEditTempleteActions.update,
        (state) => {
            return {
                ...state,
                upsertId: "",
                loading:true
            };
        }
    ),
    on( 
        ItemViewPageActions.findSuccess,
        ItemEditTempleteActions.createSuccess,
        ItemEditTempleteActions.updateSuccess,
        (state, { item }) => {
            return {
                ...state,
                upsertId: item.id,
                loading: false
            };
        }
    )
);
export const upsertId = (state: State) => state.upsertId;
export const getLoading = (state: State) => state.loading;
export const getMode = (state: State) => state.mode;