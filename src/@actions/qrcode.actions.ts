import { createAction, props } from "@ngrx/store";

export const openSidenav = createAction("[Layout] Open Sidenav");
export const closeSidenav = createAction("[Layout] Close Sidenav");
export const setTopLeft = createAction("[layout] set top left", props<{ left: string }>());
export const setTopRight = createAction("[layout] set top right", props<{ right: string }>());
export const setTopTitle = createAction("[layout] set top title", props<{ title: string }>());
