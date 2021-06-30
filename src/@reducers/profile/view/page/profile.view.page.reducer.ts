import { createReducer, on } from "@ngrx/store";
import { ProfileViewPageActions } from "@actions/profile";

export const featureKey = "profile.view.page";

export interface State {
    loading: boolean;
    mode: string;
    oldAction: string;
    id: string;
}

const initialState: State = {
    loading: false,
    mode: "",
    oldAction: "",
    id: ""
};


export const reducer = createReducer(
    initialState,
    on(ProfileViewPageActions.logout, (state, { oldAction }) => ({
            ...state,
            oldAction: oldAction
        }))
);

export const getLoading = (state: State) => state.loading;
export const getMode = (state: State) => state.mode;