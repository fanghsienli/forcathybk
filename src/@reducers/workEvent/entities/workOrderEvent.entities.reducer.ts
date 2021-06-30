import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";

import { RelationshipTargetsListTempleteActions, RelationshipTargetEditTempleteActions} from "@actions/relationshipTarget";
import { Inventory } from "@entities/inventory";

export const featureKey = "relationshipTarget.entities";

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Inventory> {
    selectedRelationshipTargetId: string | null;
    loaded: boolean;
    loading: boolean;
    ids: string[];
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Inventory> = createEntityAdapter<Inventory>({
    selectId: (relationshipTarget: Inventory) => relationshipTarget.id,
    sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
    selectedRelationshipTargetId: null,
    loaded: false,
    loading: false,
    ids: []   
});

export const reducer = createReducer(
    initialState, 
    on(
        RelationshipTargetsListTempleteActions.selectListSuccess,
        (state, { relationshipTargets }) => adapter.upsertMany(relationshipTargets, state)
    ),
    on(
        RelationshipTargetEditTempleteActions.createSuccess, 
        RelationshipTargetEditTempleteActions.updateSuccess, 
        (state, { relationshipTarget }) => adapter.upsertOne(relationshipTarget, state)
    ),
    on(
        RelationshipTargetsListTempleteActions.removeSuccess,
        (state, { relationshipTarget }) => adapter.removeOne(relationshipTarget.id, state)
    ) 
)
export const selectId = (state: State) => state.selectedRelationshipTargetId;
