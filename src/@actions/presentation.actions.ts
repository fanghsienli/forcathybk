import { createAction, props } from "@ngrx/store"; 

export const setEmpty = createAction("[presentation] set Empty");
export const more = createAction("[presentation] more", props<{ buttons: any[] }>());
export const open = createAction("[presentation] open", props<{ title: string, width: string, payload?: any }>());
export const openOk = createAction("[presentation] open ok");
export const messageOk = createAction("[presentation] message ok");
export const message = createAction("[presentation] message", props<{ message: any }>());
export const setType = createAction("[presentation] set Type", props<{ actionType: string }>());
export const close = createAction("[presentation] close", props<{ message: string }>());
export const closeOk = createAction("[presentation] close ok");
