import { Inventory } from "@entities/inventory";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action
} from "@ngrx/store";
import * as workPlansListTemplete from "../workPlans/list/templete/workPlans.list.templete.reducer";
import * as workPlanEntities from "./entities/workPlan.entities.reducer";
import * as workPlanViewPage from "./view/page/workPlan.view.page.reducer";
import * as workPlanEditTemplete from "./edit/templete/workPlan.edit.templete.reducer";
import * as fromRoot from "@reducers";

export const featureKey = "workPlan";

export interface WorkPlanState {
    [workPlanEntities.featureKey]: workPlanEntities.State;
    [workPlansListTemplete.featureKey]: workPlansListTemplete.State;
    [workPlanViewPage.featureKey]: workPlanViewPage.State;
    [workPlanEditTemplete.featureKey]: workPlanEditTemplete.State; 
}

export interface State extends fromRoot.State {
    [featureKey]: WorkPlanState;
}

export function reducers(state: WorkPlanState | undefined, action: Action) {
    return combineReducers({
        [workPlanEntities.featureKey]: workPlanEntities.reducer,
        [workPlansListTemplete.featureKey]: workPlansListTemplete.reducer,
        [workPlanViewPage.featureKey]: workPlanViewPage.reducer,
        [workPlanEditTemplete.featureKey]: workPlanEditTemplete.reducer
    })(state, action);
}

export const workPlansState = createFeatureSelector<State, WorkPlanState>(featureKey);
export const workPlanState = createFeatureSelector<State, WorkPlanState>(featureKey);
export const workPlanEntitiesState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlan.entities"]);
export const workPlanViewPageState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlan.view.page"]);
export const workPlanEditTempleteState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlan.edit.templete"]); 
export const workPlansListTempleteState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlans.list.templete"]);
export const workPlanEventEntitiesState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlanEvent.entities"]);
export const workPlanEventsListTempleteState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlanEvents.list.templete"]);
export const workPlanEventEditTempleteState = createSelector(workPlanState, (state: WorkPlanState) => state["workPlanEvent.edit.templete"]); 

export const workPlanEditTemplete_attributeId = createSelector(workPlanEditTempleteState, workPlanEditTemplete.attributeId);
export const workPlanEditTemplete_ownerId = createSelector(workPlanEditTempleteState, workPlanEditTemplete.ownerId);
export const workPlanEditTemplete_workPlan = createSelector(workPlanEditTempleteState, workPlanEditTemplete.workPlan);

export const workPlanViewPage_mode = createSelector(workPlanViewPageState, workPlanViewPage.mode);
export const workPlanViewPage_putdownCommand = createSelector(workPlanViewPageState, workPlanViewPage.putdownCommand); 
export const workPlanViewPage_upsertId = createSelector(workPlanViewPageState, workPlanViewPage.upsertId);

export const workPlansListTemplete_ids = createSelector(workPlansListTempleteState, workPlansListTemplete.ids);
export const workPlansListTemplete_upsertId = createSelector(workPlansListTempleteState, workPlansListTemplete.upsertId);
export const workPlansListTemplete_removeId = createSelector(workPlansListTempleteState, workPlansListTemplete.removeId);
export const workPlansListTemplete_total = createSelector(workPlansListTempleteState, workPlansListTemplete.total);

export const {
    selectIds: selectWorkPlanIds,
    selectEntities: workPlans,
    selectAll: selectAllWorkPlans,
    selectTotal: selectTotalWorkPlans,
} = workPlanEntities.adapter.getSelectors(workPlanEntitiesState);

export const selectCollectionWorkPlanIds = createSelector(
    workPlansListTempleteState,
    workPlansListTemplete.ids
);

export const workPlanEntities_find = () =>
    createSelector(
        workPlans,
        (workPlans, props) => {
            return workPlans[props.id];
        }
    );

export const selectWorkPlanCollection = createSelector(
    workPlans,
    selectCollectionWorkPlanIds,
    (entities, ids) => {
        return ids
            .map(id => entities[id])
            .filter((workPlan): workPlan is Inventory => workPlan != null);
    }
);

export const workPlanViewPageMode = createSelector(
    workPlanViewPageState,
    workPlanViewPage.mode
);

export const getWorkPlans = () => createSelector(
    workPlans,
    workPlansListTemplete_ids,
    workPlansListTempleteState,
    (workPlans, ids, state, props) => {
        if (ids && state.loaded) {
            let anyLike = state.anyLike.trimStart().trimEnd();
            let result = ids.map(id => workPlans[id]);
            return {
                anyLike: anyLike,
                count: state.total,
                workPlans: result,
                loaded: state.loaded && !state.loading
            };
        } else return { workPlans: [], loaded: state.loaded && !state.loading };
    }
);
