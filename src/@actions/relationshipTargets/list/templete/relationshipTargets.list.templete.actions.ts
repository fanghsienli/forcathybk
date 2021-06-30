import { createAction, props } from "@ngrx/store";
import { Inventory } from "@entities/inventory";
import { Attribute } from "@entities/attribute";
import { ItemAttribute } from "@entities/item";
export const more = createAction("[relationshipTargets.list.templete] more", props<{ buttons: any[] }>());
export const newRelationshipTarget = createAction("[relationshipTargets.list.templete] new relationshipTarget");
export const editRelationshipTarget = createAction("[relationshipTargets.list.templete] edit relationshipTarget", props<{ relationshipTarget: Inventory }>());

export const setSort = createAction("[relationshipTargets.list.templete] set sort", props<{ orderBy: string, descending: boolean }>());
export const setFilter = createAction("[relationshipTargets.list.templete] set filter", props<{ anyLike: string }>());
export const setConditions = createAction("[relationshipTargets.list.templete] set conditions", props<{ ownerId: string, attributeId: string }>());
export const setAttribute = createAction("[relationshipTargets.list.templete] set attribute", props<{ attribute: Attribute }>());
export const setPageIndex = createAction('[relationshipTargets.list.templete] set pageIndex', props<{ pageIndex: number }>());
export const setPageSize = createAction('[relationshipTargets.list.templete] set pageSize', props<{ pageSize: number }>());

export const selectList = createAction("[relationshipTargets.list.templete] select list");
export const selectListSuccess = createAction("[relationshipTargets.list.templete] select list success", props<{ relationshipTargets: Inventory[], total: number }>());
export const selectListFailure = createAction("[relationshipTargets.list.templete] select list failure", props<{ error: any }>());

export const remove = createAction("[relationshipTargets.list.templete] remove", props<{ relationshipTarget: Inventory }>());
export const removeSuccess = createAction("[relationshipTargets.list.templete] remove success", props<{ relationshipTarget: Inventory }>());
export const removeFailure = createAction("[relationshipTargets.list.templete] remove failure", props<{ relationshipTarget: Inventory }>());