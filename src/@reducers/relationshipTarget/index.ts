import { Inventory } from "@entities/inventory";
import { Action, combineReducers, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRoot from "@reducers";
import * as relationshipTargetsListTemplete from "../relationshipTargets/list/templete/relationshipTargets.list.templete.reducer";
import * as relationshipTargetEditTemplete from "./edit/templete/relationshipTarget.edit.templete.reducer";
import * as relationshipTargetEntities from "./entities/relationshipTarget.entities.reducer";

export const featureKey = "relationshipTarget";

export interface RelationshipTargetState {
    [relationshipTargetEntities.featureKey]: relationshipTargetEntities.State;
    [relationshipTargetsListTemplete.featureKey]: relationshipTargetsListTemplete.State;
    [relationshipTargetEditTemplete.featureKey]: relationshipTargetEditTemplete.State; 
}

export interface State extends fromRoot.State {
    [featureKey]: RelationshipTargetState;
}

export function reducers(state: RelationshipTargetState | undefined, action: Action) {
    return combineReducers({
        [relationshipTargetEntities.featureKey]: relationshipTargetEntities.reducer,
        [relationshipTargetsListTemplete.featureKey]: relationshipTargetsListTemplete.reducer,
        [relationshipTargetEditTemplete.featureKey]: relationshipTargetEditTemplete.reducer 
    })(state, action);
}

export const relationshipTargetsState = createFeatureSelector<State, RelationshipTargetState>(featureKey);
export const relationshipTargetState = createFeatureSelector<State, RelationshipTargetState>(featureKey);
export const relationshipTargetEntitiesState = createSelector(relationshipTargetState, (state: RelationshipTargetState) => state["relationshipTarget.entities"]);
export const relationshipTargetsListTempleteState = createSelector(relationshipTargetState, (state: RelationshipTargetState) => state["relationshipTargets.list.templete"]);

export const relationshipTargetEditTempleteState = createSelector(relationshipTargetState, (state: RelationshipTargetState) => state["relationshipTarget.edit.templete"]); 
export const relationshipTargetEditTemplete_attributeId = createSelector(relationshipTargetEditTempleteState, relationshipTargetEditTemplete.attributeId);
export const relationshipTargetEditTemplete_ownerId = createSelector(relationshipTargetEditTempleteState, relationshipTargetEditTemplete.ownerId);
export const relationshipTargetEditTemplete_relationshipTarget = createSelector(relationshipTargetEditTempleteState, relationshipTargetEditTemplete.relationshipTarget); 

export const relationshipTargetsListTemplete_ids = createSelector(relationshipTargetsListTempleteState, relationshipTargetsListTemplete.ids);
export const relationshipTargetsListTemplete_upsertId = createSelector(relationshipTargetsListTempleteState, relationshipTargetsListTemplete.upsertId);
export const relationshipTargetsListTemplete_removeId = createSelector(relationshipTargetsListTempleteState, relationshipTargetsListTemplete.removeId);
export const relationshipTargetsListTemplete_total = createSelector(relationshipTargetsListTempleteState, relationshipTargetsListTemplete.total); 

export const {
    selectIds: ids,
    selectEntities: entities,
    selectAll: all,
    selectTotal: total,
} = relationshipTargetEntities.adapter.getSelectors(relationshipTargetEntitiesState);
 

export const selectCollectionRelationshipTargetIds = createSelector(
    relationshipTargetsListTempleteState,
    relationshipTargetsListTemplete.ids
);

export const relationshipTargetEntities_find = () =>
    createSelector(
        entities,
        (relationshipTargets, props) => {
            return relationshipTargets[props.id];
        }
    );

export const relationshipTargetsListTemplete_entities = createSelector(
    entities,
    relationshipTargetsListTemplete_ids,
    (entities, ids) => {
        return ids
            .map(id => entities[id])
            .filter((relationshipTarget): relationshipTarget is Inventory => relationshipTarget != null);
    }
);
 

export const getRelationshipTargets = () =>
    createSelector(
        entities,
        relationshipTargetsListTemplete_ids,
        relationshipTargetsListTempleteState,
        (relationshipTargets, ids, state, props) => {
            if (ids && state.loaded) {
                let anyLike = state.anyLike.trimStart().trimEnd();
                let result = ids.map(id => relationshipTargets[id]);
                return {
                    anyLike: anyLike,
                    count: state.total,
                    relationshipTargets: result,
                    loaded: state.loaded && !state.loading 
                };
            } else return { relationshipTargets: [], loaded: state.loaded && !state.loading };
        }
    ); 