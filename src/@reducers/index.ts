import {
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer,
    Action,
    ActionReducerMap,
} from "@ngrx/store";
import { environment } from "environments/environment";
import * as fromRouter from "@ngrx/router-store";

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as presentation from "./presentation.reducer";
import * as layout from "./layout.reducer";
import { InjectionToken } from "@angular/core";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keies to inner state types.
 */
export interface State {
    [layout.featureKey]: layout.State;
    [presentation.featureKey]: presentation.State;
    router: fromRouter.RouterReducerState<any>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const ROOT_REDUCERS = new InjectionToken<
    ActionReducerMap<State, Action>
>("Root reducers token", {
    factory: () => ({
        router: fromRouter.routerReducer,
        [presentation.featureKey]: presentation.reducer,
        [layout.featureKey]: layout.reducer
    }),
});

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state, action) => {
        const result = reducer(state, action);
        console.groupCollapsed(action.type);
        console.log("prev state", state);
        console.log("action", action);
        console.log("next state", result);
        console.groupEnd();
        return result;
    };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [logger]
    : [];

/**
 * Layout Reducers
 */
export const layoutState = createFeatureSelector<State, layout.State>(
    "layout"
);

export const presentationState = createFeatureSelector<State, presentation.State>(
    "presentation"
);
export const presentation_message = createSelector(presentationState, presentation.message);
export const presentation_width = createSelector(presentationState, presentation.width);
export const presentation_buttons = createSelector(presentationState, presentation.buttons);
export const presentation_type = createSelector(presentationState, presentation.type);
export const presentation_title = createSelector(presentationState, presentation.title);
export const presentation_item = createSelector(presentationState, presentation.item);
export const presentation_station = createSelector(presentationState, presentation.station);
export const presentation_limit = createSelector(presentationState, presentation.limit);
export const presentation_workOrder = createSelector(presentationState, presentation.workOrder);
export const layout_topTitle = createSelector(layoutState, layout.topTitle);
export const layout_topRight = createSelector(layoutState, layout.topRight);
export const layout_topLeft = createSelector(layoutState, layout.topLeft);
export const selecthowSidenav = createSelector(layoutState, layout.selectShowSidenav);


