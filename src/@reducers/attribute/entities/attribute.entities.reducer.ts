import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on, Action } from "@ngrx/store";
import { AttributeEntitiesActions } from "@actions/attribute";
import { Attribute } from "@entities/attribute";

export const featureKey = "attribute.entities";
export const adapter: EntityAdapter<Attribute> = createEntityAdapter<Attribute>();
export const initialState: State = adapter.getInitialState({ selectedAttributeId: null });
export interface State extends EntityState<Attribute> { selectedAttributeId: number | null; }

const attributeReducer = createReducer(
    initialState,
    on(AttributeEntitiesActions.addAttribute, (state, { attribute }) => {
        return adapter.addOne(attribute, state)
    }),
    on(AttributeEntitiesActions.setAttribute, (state, { attribute }) => {
        return adapter.setOne(attribute, state)
    }),
    on(AttributeEntitiesActions.upsertAttribute, (state, { attribute }) => {
        return adapter.upsertOne(attribute, state);
    }),
    on(AttributeEntitiesActions.addAttributes, (state, { attributes }) => {
        return adapter.addMany(attributes, state);
    }),
    on(AttributeEntitiesActions.upsertAttributes, (state, { attributes }) => {
        return adapter.upsertMany(attributes, state);
    }),
    on(AttributeEntitiesActions.updateAttribute, (state, { attribute }) => {
        return adapter.updateOne(attribute, state);
    }),
    on(AttributeEntitiesActions.updateAttributes, (state, { attributes }) => {
        return adapter.updateMany(attributes, state);
    }),
    on(AttributeEntitiesActions.mapAttributes, (state, { entityMap }) => {
        return adapter.map(entityMap, state);
    }),
    on(AttributeEntitiesActions.deleteAttribute, (state, { id }) => {
        return adapter.removeOne(id, state);
    }),
    on(AttributeEntitiesActions.deleteAttributes, (state, { ids }) => {
        return adapter.removeMany(ids, state);
    }),
    on(AttributeEntitiesActions.deleteAttributesByPredicate, (state, { predicate }) => {
        return adapter.removeMany(predicate, state);
    }),
    on(AttributeEntitiesActions.loadAttributes, (state, { attributes }) => {
        return adapter.addAll(attributes, state);
    }),
    on(AttributeEntitiesActions.clearAttributes, state => {
        return adapter.removeAll({ ...state, selectedAttributeId: null });
    })
);

export function reducer(state: State | undefined, action: Action) {
    return attributeReducer(state, action);
}

export const getSelectedAttributeId = (state: State) => state.selectedAttributeId;


// get the selectors
const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();

// select the array of attribute ids
export const selectAttributeIds = selectIds;

// select the dictionary of attribute entities
export const selectAttributeEntities = selectEntities;

// select the array of attributes
export const selectAllAttributes = selectAll;

// select the total attribute count
export const selectAttributeTotal = selectTotal;

