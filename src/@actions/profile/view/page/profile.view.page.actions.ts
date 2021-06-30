import { createAction, props } from "@ngrx/store";

export const more = createAction("[profile.view.page] more", props<{ buttons: any[] }>());
export const logout = createAction("[profile.view.page] logout", props<{ oldAction: string }>());

export const oldActionOk = createAction("[profile.view.page] old action ok");
