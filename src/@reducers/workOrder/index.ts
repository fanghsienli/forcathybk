import { Inventory } from "@entities/inventory";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action
} from "@ngrx/store";
import * as workOrdersListTemplete from "../workOrders/list/templete/workOrders.list.templete.reducer";
import * as workOrderEntities from "./entities/workOrder.entities.reducer";
import * as workOrderViewPage from "./view/page/workOrder.view.page.reducer";
import * as workOrderEditTemplete from "./edit/templete/workOrder.edit.templete.reducer";
import * as workOrderEventsListTemplete from "../workOrderEvents/list/templete/workOrderEvents.list.templete.reducer";
import * as workOrderEventEditTemplete from "../workOrderEvent/edit/templete/workOrderEvent.edit.templete.reducer";
import * as fromRoot from "@reducers";

export const featureKey = "workOrder";

export interface WorkOrderState {
    [workOrderEntities.featureKey]: workOrderEntities.State;
    [workOrdersListTemplete.featureKey]: workOrdersListTemplete.State;
    [workOrderViewPage.featureKey]: workOrderViewPage.State;
    [workOrderEventsListTemplete.featureKey]: workOrderEventsListTemplete.State;
    [workOrderEditTemplete.featureKey]: workOrderEditTemplete.State; 
    [workOrderEventEditTemplete.featureKey]: workOrderEventEditTemplete.State; 
}

export interface State extends fromRoot.State {
    [featureKey]: WorkOrderState;
}

export function reducers(state: WorkOrderState | undefined, action: Action) {
    return combineReducers({
        [workOrderEntities.featureKey]: workOrderEntities.reducer,
        [workOrdersListTemplete.featureKey]: workOrdersListTemplete.reducer,
        [workOrderViewPage.featureKey]: workOrderViewPage.reducer,
        [workOrderEditTemplete.featureKey]: workOrderEditTemplete.reducer,
        [workOrderEventsListTemplete.featureKey]: workOrderEventsListTemplete.reducer,
        [workOrderEventEditTemplete.featureKey]: workOrderEventEditTemplete.reducer 
    })(state, action);
}

export const workOrdersState = createFeatureSelector<State, WorkOrderState>(featureKey);
export const workOrderState = createFeatureSelector<State, WorkOrderState>(featureKey);
export const workOrderEntitiesState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrder.entities"]);
export const workOrderViewPageState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrder.view.page"]);
export const workOrderEditTempleteState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrder.edit.templete"]); 
export const workOrdersListTempleteState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrders.list.templete"]);
export const workOrderEventEntitiesState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrderEvent.entities"]);
export const workOrderEventsListTempleteState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrderEvents.list.templete"]);
export const workOrderEventEditTempleteState = createSelector(workOrderState, (state: WorkOrderState) => state["workOrderEvent.edit.templete"]); 

export const workOrderEditTemplete_attributeId = createSelector(workOrderEditTempleteState, workOrderEditTemplete.attributeId);
export const workOrderEditTemplete_ownerId = createSelector(workOrderEditTempleteState, workOrderEditTemplete.ownerId);
export const workOrderEditTemplete_workOrder = createSelector(workOrderEditTempleteState, workOrderEditTemplete.workOrder);

export const workOrderViewPage_mode = createSelector(workOrderViewPageState, workOrderViewPage.mode);
export const workOrderViewPage_putdownCommand = createSelector(workOrderViewPageState, workOrderViewPage.putdownCommand); 
export const workOrderViewPage_upsertId = createSelector(workOrderViewPageState, workOrderViewPage.upsertId);


export const workOrdersListTemplete_ids = createSelector(workOrdersListTempleteState, workOrdersListTemplete.ids);
export const workOrdersListTemplete_upsertId = createSelector(workOrdersListTempleteState, workOrdersListTemplete.upsertId);
export const workOrdersListTemplete_removeId = createSelector(workOrdersListTempleteState, workOrdersListTemplete.removeId);
export const workOrdersListTemplete_total = createSelector(workOrdersListTempleteState, workOrdersListTemplete.total);

export const workOrderEventEditTemplete_attributeId = createSelector(workOrderEventEditTempleteState, workOrderEventEditTemplete.attributeId);
export const workOrderEventEditTemplete_ownerId = createSelector(workOrderEventEditTempleteState, workOrderEventEditTemplete.ownerId);
export const workOrderEventEditTemplete_workOrderEvent = createSelector(workOrderEventEditTempleteState, workOrderEventEditTemplete.workOrderEvent);

export const workOrderEventsListTemplete_ids = createSelector(workOrderEventsListTempleteState, workOrderEventsListTemplete.ids);
export const workOrderEventsListTemplete_upsertId = createSelector(workOrderEventsListTempleteState, workOrderEventsListTemplete.upsertId);
export const workOrderEventsListTemplete_removeId = createSelector(workOrderEventsListTempleteState, workOrderEventsListTemplete.removeId);
export const workOrderEventsListTemplete_total = createSelector(workOrderEventsListTempleteState, workOrderEventsListTemplete.total);  




export const {
    selectIds: selectWorkOrderIds,
    selectEntities: workOrders,
    selectAll: selectAllWorkOrders,
    selectTotal: selectTotalWorkOrders,
} = workOrderEntities.adapter.getSelectors(workOrderEntitiesState);

export const selectCollectionWorkOrderIds = createSelector(
    workOrdersListTempleteState,
    workOrdersListTemplete.ids
);

export const workOrderEntities_find = () =>
    createSelector(
        workOrders,
        (workOrders, props) => {
            return workOrders[props.id];
        }
    );

export const selectWorkOrderCollection = createSelector(
    workOrders,
    selectCollectionWorkOrderIds,
    (entities, ids) => {
        return ids
            .map(id => entities[id])
            .filter((workOrder): workOrder is Inventory => workOrder != null);
    }
);

export const workOrderViewPageMode = createSelector(
    workOrderViewPageState,
    workOrderViewPage.mode
);

export const getWorkOrders = () => createSelector(
    workOrders,
    workOrdersListTemplete_ids,
    workOrdersListTempleteState,
    (workOrders, ids, state, props) => {
        if (ids && state.loaded) {
            let anyLike = state.anyLike.trimStart().trimEnd();
            let result = ids.map(id => workOrders[id]);
            return {
                anyLike: anyLike,
                count: state.total,
                workOrders: result,
                loaded: state.loaded && !state.loading
            };
        } else return { workOrders: [], loaded: state.loaded && !state.loading };
    }
);
