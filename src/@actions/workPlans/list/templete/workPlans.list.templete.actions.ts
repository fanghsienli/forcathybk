import { createAction, props } from "@ngrx/store"; 
import { Inventory } from "@entities/inventory";

export const create = createAction("[workPlans.list.templete] create", props<{ workPlan: Inventory }>());
export const createSuccess = createAction("[workPlans.list.templete] create success", props<{ workPlan: Inventory }>());
export const createFailure = createAction("[workPlans.list.templete] create failure", props<{ workPlan: Inventory }>());
export const update = createAction("[workPlans.list.templete] update", props<{ workPlan: Inventory }>());
export const updateSuccess = createAction("[workPlans.list.templete] update success", props<{ workPlan: Inventory }>());
export const updateFailure = createAction("[workPlans.list.templete] update failure", props<{ workPlan: Inventory }>());
export const setSort = createAction("[workPlans.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[workPlans.list.templete] set filter", props<{ anyLike: string }>());
export const setPageIndex = createAction('[workPlans.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[workPlans.list.templete] set pageSize', props<{ pageSize: number }>());

export const selectList = createAction("[workPlans.list.templete] select list");
export const selectListSuccess = createAction("[workPlans.list.templete] select list success", props<{ workPlans: Inventory[], total: number }>());
export const selectListFailure = createAction("[workPlans.list.templete] select list failure", props<{ error: any }>());

export const editWorkPlan = createAction("[workPlans.list.templete] edit workPlan", props<{ workPlan: Inventory }>());
export const newWorkPlan = createAction("[workPlans.list.templete] new workPlan");

export const exportOk = createAction("[workPlans.list.templete] export ok");

export const remove = createAction("[workPlans.list.templete] remove", props<{ workPlan: Inventory }>());
export const removeSuccess = createAction("[workPlans.list.templete] remove success", props<{ workPlan: Inventory }>());
export const removeFailure = createAction("[workPlans.list.templete] remove failure", props<{ workPlan: Inventory }>());


export const more = createAction("[inventories.list.templete] more", props<{ buttons: any[] }>());
export const setEmpty = createAction("[workPlans.list.templete] remove filter - all");

export const goToEdit = createAction("[workPlans.list.templete] go to edit", props<{ id: string }>());
export const goToEditOk = createAction("[workPlans.list.templete] go to edit ok");