import { Action, combineReducers, createSelector, createFeatureSelector } from "@ngrx/store";
import * as app from "@reducers";
import * as profileViewPage from "./view/page/profile.view.page.reducer";

export const featureKey = "profile";

export interface ProfileState {
    [profileViewPage.featureKey]: profileViewPage.State;
}

export interface State extends app.State {
    [featureKey]: ProfileState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: ProfileState | undefined, action: Action) {
    return combineReducers({
        [profileViewPage.featureKey]: profileViewPage.reducer
    })(state, action);
}

export const profileState = createFeatureSelector<State, ProfileState>(
    featureKey
);

export const profileViewPageState = createSelector(profileState, (state: ProfileState) => state["profile.view.page"]);
