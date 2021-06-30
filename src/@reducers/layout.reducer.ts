import { createReducer, on } from "@ngrx/store";
import { LayoutActions } from "@actions";
import { AuthActions } from "app/auth/actions";

export const featureKey = "layout";
 
export interface State {
    showSidenav: boolean;
   topLeft: string;
    topRight: string;
    topTitle: string;
}

const initialState: State = {
    showSidenav: false,
    topLeft: "",
    topRight: "",
    topTitle: "" 
};

export const reducer = createReducer(
    initialState,
    on(LayoutActions.setTopLeft, (state, { left }) => ({ ...state, topLeft: left })),
    // Even thought the `state` is unused, it helps infer the return type
    on(LayoutActions.setTopLeft, (state, { left }) => ({ ...state, topLeft: left })),
    on(LayoutActions.setTopRight, (state, { right }) => ({ ...state, topRight: right })),
    on(LayoutActions.setTopTitle, (state, { title }) => ({ ...state, topTitle: title })),
    on(LayoutActions.closeSidenav, (state, {  }) => ({ ...state, showSidenav: false })),
    on(LayoutActions.openSidenav, (state, {  }) => ({ ...state, showSidenav: true })),
    on(AuthActions.logoutConfirmation, (state, {  }) => ({ ...state, showSidenav: false }))
);

export const selectShowSidenav = (state: State) => state.showSidenav;
export const topLeft = (state: State) => state.topLeft;
export const topRight = (state: State) => state.topRight;
export const topTitle = (state: State) => state.topTitle;

