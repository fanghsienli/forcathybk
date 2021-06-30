import { Attribute } from "@entities/attribute";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action,
} from "@ngrx/store";

import * as attributeEntitiesReducer from "./entities/attribute.entities.reducer";
import * as attributesCheckboxTempleteReducer from "../attributes/checkobx/templete/attributes.checkbox.templete.reducer";
import * as fromRoot from "@reducers";
export const featureKey = "attribute";

export interface AttributeState {
    [attributeEntitiesReducer.featureKey]: attributeEntitiesReducer.State;
    [attributesCheckboxTempleteReducer.featureKey]: attributesCheckboxTempleteReducer.State;
}

export interface State extends fromRoot.State {
    [featureKey]: AttributeState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: AttributeState | undefined, action: Action) {
    return combineReducers({
        [attributeEntitiesReducer.featureKey]: attributeEntitiesReducer.reducer,
        [attributesCheckboxTempleteReducer.featureKey]: attributesCheckboxTempleteReducer.reducer
    })(state, action);
}
export const attributeState = createFeatureSelector<State, AttributeState>(
    featureKey
); 

export const attributeEntitiesState = createSelector(attributeState, (state: AttributeState) => state["attribute.entities"]);
export const attributesCheckboxTempleteState = createSelector(attributeState, (state: AttributeState) => state["attributes.checkbox.templete"]);
export const attributesCheckboxTemplete_ids = createSelector(attributesCheckboxTempleteState, attributesCheckboxTempleteReducer.ids);

export const attributesCheckboxTemplete_selectedIds = createSelector(attributesCheckboxTempleteState, attributesCheckboxTempleteReducer.selectedIds);

export const attributes = createSelector(
    attributeEntitiesState,
    attributeEntitiesReducer.selectAttributeEntities
);
export const selectAttributeEntitiesState = attributeEntitiesState;
export const selectAttributeEntities = attributeEntitiesReducer.selectAttributeEntities;
export const attributeEntities_attributes = () =>
    createSelector(
        attributes,
        (attributes, props) => {
            return props.ids.map(id => attributes[id]);
        }
    );

export const attributeEntities_attribute = () =>
    createSelector(
        attributes,
        (attributes, props) => {
            return attributes[props.id];
        }
    );
export const attributesCheckboxTemplete_checkedAttributes = () =>
    createSelector(
        attributes,
        attributesCheckboxTemplete_selectedIds,
        (attributes, selectedIds) => {
            return selectedIds.map(id => attributes[id]);
        }
    );
export const attributesCheckboxTemplete_attributes = () =>
    createSelector(
        attributes,
        attributesCheckboxTemplete_ids,
        attributesCheckboxTempleteState,
        (attributes, ids, state, props) => {
            if (attributes && ids && state.loaded) {
                let anyLike = state.anyLike.trimStart().trimEnd();
                let result = ids.map(id => attributes[id]);          
                return {
                    anyLike: anyLike,
                    count: state.total, 
                    attributes: result,
                    loaded: state.loaded && !state.loading
                };
            } else return { attributes: [], loaded: state.loaded && !state.loading };
        }
    );


