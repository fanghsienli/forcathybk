import { Gen } from "@entities/entity";
import { Item } from "@entities/item";
import { Action, combineReducers, createFeatureSelector, createSelector } from "@ngrx/store";
import * as app from "@reducers";
import * as itemAttributeEditTemplete from "../itemAttribute/edit/templete/itemAttribute.edit.templete.reducer";
import * as itemAttributeEntities from "../itemAttribute/entities/itemAttribute.entities.reducer";
import * as itemAttributesListTemplete from "../itemAttributes/list/templete/itemAttributes.list.templete.reducer";
import * as itemsListTemplete from "../items/list/templete/items.list.templete.reducer";
import * as itemEntities from "./entities/item.entities.reducer";
import * as itemViewPage from "./view/page/item.view.page.reducer";
import * as itemEditTemplete from "./edit/templete/item.edit.templete.reducer";
export const featureKey = "item";

export interface ItemState {
    [itemViewPage.featureKey]: itemViewPage.State;
    [itemEditTemplete.featureKey]: itemEditTemplete.State;
    [itemEntities.featureKey]: itemEntities.State;
    [itemAttributeEntities.featureKey]: itemAttributeEntities.State;
    [itemsListTemplete.featureKey]: itemsListTemplete.State;
    [itemAttributesListTemplete.featureKey]: itemAttributesListTemplete.State;
    [itemAttributeEditTemplete.featureKey]: itemAttributeEditTemplete.State;
}

export interface State extends app.State {
    [featureKey]: ItemState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: ItemState | undefined, action: Action) {
    return combineReducers({
        [itemEntities.featureKey]: itemEntities.reducer,
        [itemViewPage.featureKey]: itemViewPage.reducer,
        [itemsListTemplete.featureKey]: itemsListTemplete.reducer,
        [itemEditTemplete.featureKey]: itemEditTemplete.reducer,
        [itemAttributeEntities.featureKey]: itemAttributeEntities.reducer,
        [itemAttributesListTemplete.featureKey]: itemAttributesListTemplete.reducer,
        [itemAttributeEditTemplete.featureKey]: itemAttributeEditTemplete.reducer
    })(state, action);
}

export const itemState = createFeatureSelector<State, ItemState>(
    featureKey
);

export const itemEntitiesState = createSelector(itemState, (state: ItemState) => state["item.entities"]);
export const itemViewPageState = createSelector(itemState, (state: ItemState) => state["item.view.page"]);
export const itemsListTempleteState = createSelector(itemState, (state: ItemState) => state["items.list.templete"]);
export const itemEditTempleteState = createSelector(itemState, (state: ItemState) => state["item.edit.templete"]);
export const itemAttributeEntitiesState = createSelector(itemState, (state: ItemState) => state["itemAttribute.entities"]);
export const itemAttributesListTempleteState = createSelector(itemState, (state: ItemState) => state["itemAttributes.list.templete"]);
export const itemAttributeEditTempleteState = createSelector(itemState, (state: ItemState) => state["itemAttribute.edit.templete"]);

export const {
    selectIds: selectItemIds,
    selectEntities: items,
    selectAll: selectAllItems,
    selectTotal: selectTotalItems
} = itemEntities.adapter.getSelectors(itemEntitiesState);

export const {
    selectIds: selectItemAttributeIds,
    selectEntities: itemAttributes,
    selectAll: selectAllItemAttributes,
    selectTotal: selectTotalItemAttributes
} = itemAttributeEntities.adapter.getSelectors(itemAttributeEntitiesState);

export const selectSelectedItemId = createSelector(itemEntitiesState, itemEntities.selectId);


export const itemEntities_item = () => createSelector(
    items,
    (items, props) => {
        return items[props.id];
    }
);

export const itemViewPage_upsertId = createSelector(itemViewPageState, itemViewPage.upsertId);
export const itemEditTemplete_item = createSelector(itemEditTempleteState, itemEditTemplete.item);
export const itemsListTemplete_upsertId = createSelector(itemsListTempleteState, itemsListTemplete.upsertId);
export const itemsListTemplete_uploadIds = createSelector(itemsListTempleteState, itemsListTemplete.uploadIds);
export const itemsListTemplete_removeId = createSelector(itemsListTempleteState, itemsListTemplete.removeId);
export const itemAttributesListTemplete_ids = createSelector(itemAttributesListTempleteState, itemAttributesListTemplete.ids);
export const itemAttributesListTemplete_upsertId = createSelector(itemAttributesListTempleteState, itemAttributesListTemplete.upsertId);
export const itemAttributesListTemplete_removeId = createSelector(itemAttributesListTempleteState, itemAttributesListTemplete.removeId);
export const itemsListTemplete_total = createSelector(itemsListTempleteState, itemsListTemplete.total);
export const itemAttributeEditTemplete_itemAttribute = createSelector(itemAttributeEditTempleteState, itemAttributeEditTemplete.itemAttribute);


export const selectSelectedItem = createSelector(items, selectSelectedItemId,
    (entities, selectedId) => {
        return selectedId && entities[selectedId];
    }
);
export const selectListCategoryId = createSelector(
    itemsListTempleteState,
    itemsListTemplete.categoryId
);
export const itemsListTemplete_ids = createSelector(
    itemsListTempleteState,
    itemsListTemplete.ids
);
export const listPageSize = createSelector(
    itemsListTempleteState,
    itemsListTemplete.pageSize
);
export const itemsListIdsLength = createSelector(
    itemsListTemplete_ids,
    (ids) => {
        return ids.length;
    }
);

export const selectListResults = createSelector(
    items,
    itemsListTemplete_ids,
    (items, ids) => {

        if (ids) {
            return ids.map(id => items[id])
                .filter((item): item is Item => item != null);
        }
        else return [];
    }
);
export const getLoaded = createSelector(
    itemsListTempleteState,
    (state) => {
        return !state.loading;
    }
);

export const itemAttributesListTemplete_itemAttribute = () =>
    createSelector(
        itemAttributes,
        (itemAttributes, props) => {
            return itemAttributes[props.id];
        }
    );

export const itemAttributeEntitiesIds = createSelector(
    itemAttributeEntitiesState,
    itemAttributeEntities.ids
);
export const itemAttributesListTemplete_itemAttributes = () =>
    createSelector(
        itemAttributes,
        itemAttributesListTemplete_ids,
        itemAttributesListTempleteState,
        (itemAttributes, ids, state, props) => {
            if (ids && state.loaded) {
                let anyLike = state.anyLike.trimStart().trimEnd();
                let pageSize = state.pageSize;
                let pageIndex = props.pageIndex;
                let descending = state.descending;
                let orderBy = state.orderBy;
                let result = ids.map(id => itemAttributes[id]);

                // .filter((itemAttribute): itemAttribute is ItemAttribute => itemAttribute !== null && Gen.filterTest(itemAttribute, fields, anyLike));

                if (orderBy && result !== []) {

                    Gen.sortList(orderBy, result, descending);
                }

                return {
                    anyLike: anyLike,
                    count: result.length,
                    itemAttributes: result.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
                    loaded: state.loaded && !state.loading
                };
            } else return { itemAttributes: [], loaded: state.loaded && !state.loading };
        }
    );








export const getItems = () =>
    createSelector(
        items,
        itemsListTemplete_ids,
        itemsListTempleteState,
        (items, ids, state, props) => {
            if (ids && state.loaded) { 
                return { 
                    count: state.total, 
                    items: ids.map(id => items[id]),
                    loaded: state.loaded && !state.loading
                };
            } else return { items: [], loaded: state.loaded && !state.loading };
        }
    );



export const itemViewPageMode = createSelector(
    itemViewPageState,
    itemViewPage.getMode
);
