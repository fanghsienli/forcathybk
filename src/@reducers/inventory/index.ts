import { Inventory } from "@entities/inventory";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action,
} from "@ngrx/store";
import * as inventoriesListTemplete from "../inventories/list/templete/inventories.list.templete.reducer";
import * as inventoryEntities from "./entities/inventory.entities.reducer"; 
import * as inventoryViewPage from "./view/page/inventory.view.page.reducer";
import * as inventoryEditTemplete from "./edit/templete/inventory.edit.templete.reducer";
import * as inventoryAttributeEntities from "../inventoryAttribute/entities/inventoryAttribute.entities.reducer";
import * as inventoryAttributesListTemplete from "../inventoryAttributes/list/templete/inventoryAttributes.list.templete.reducer";
import * as fromRoot from "@reducers"; 

export const featureKey = "inventory";

export interface InventoryState {
    [inventoryEntities.featureKey]: inventoryEntities.State;
    [inventoriesListTemplete.featureKey]: inventoriesListTemplete.State;
    [inventoryAttributesListTemplete.featureKey]: inventoryAttributesListTemplete.State;
    [inventoryAttributeEntities.featureKey]: inventoryAttributeEntities.State;
    [inventoryViewPage.featureKey]: inventoryViewPage.State;
    [inventoryEditTemplete.featureKey]: inventoryEditTemplete.State;
}

export interface State extends fromRoot.State {
    [featureKey]: InventoryState;
}

export function reducers(state: InventoryState | undefined, action: Action) {
    return combineReducers({
        [inventoryEntities.featureKey]: inventoryEntities.reducer,
        [inventoriesListTemplete.featureKey]: inventoriesListTemplete.reducer,
        [inventoryViewPage.featureKey]: inventoryViewPage.reducer,
        [inventoryAttributesListTemplete.featureKey]: inventoryAttributesListTemplete.reducer,
        [inventoryAttributeEntities.featureKey]: inventoryAttributeEntities.reducer,
        [inventoryEditTemplete.featureKey]: inventoryEditTemplete.reducer
    })(state, action);
}

export const inventoryState = createFeatureSelector<State, InventoryState>(featureKey);
export const inventoryEntitiesState = createSelector(inventoryState, (state: InventoryState) => state["inventory.entities"]);
export const inventoriesListTempleteState = createSelector(inventoryState, (state: InventoryState) => state["inventories.list.templete"]);
export const inventoryViewPageState = createSelector(inventoryState, (state: InventoryState) => state["inventory.view.page"]);
export const inventoryEditTempleteState = createSelector(inventoryState, (state: InventoryState) => state["inventory.edit.templete"]);
export const inventoryAttributeEntitiesState = createSelector(inventoryState, (state: InventoryState) => state["inventoryAttribute.entities"]);
export const inventoryAttributesListTempleteState = createSelector(inventoryState, (state: InventoryState) => state["inventoryAttributes.list.templete"]);

export const inventoryViewPage_upsertId = createSelector(inventoryViewPageState, inventoryViewPage.upsertId);
export const inventoriesListTemplete_ids = createSelector(inventoriesListTempleteState, inventoriesListTemplete.ids);
export const inventoriesListTemplete_itemId = createSelector(inventoriesListTempleteState, inventoriesListTemplete.itemId);
export const inventoriesListTemplete_inventoryId = createSelector(inventoriesListTempleteState, inventoriesListTemplete.inventoryId);
export const inventoriesListTemplete_attributeIds = createSelector(inventoriesListTempleteState, inventoriesListTemplete.attributeIds);
export const inventoriesListTemplete_upsertId = createSelector(inventoriesListTempleteState, inventoriesListTemplete.upsertId);
export const inventoriesListTemplete_removeId = createSelector(inventoriesListTempleteState, inventoriesListTemplete.removeId);
export const inventoriesListTemplete_total = createSelector(inventoriesListTempleteState, inventoriesListTemplete.total);
export const inventoriesListTemplete_imported = createSelector(inventoriesListTempleteState, inventoriesListTemplete.imported);
export const inventoriesListTemplete_exported = createSelector(inventoriesListTempleteState, inventoriesListTemplete.exported);
export const inventoryEditTemplete_attributeId = createSelector(inventoryEditTempleteState, inventoryEditTemplete.attributeId);
export const inventoryEditTemplete_item = createSelector(inventoryEditTempleteState, inventoryEditTemplete.item); 
export const inventoryEditTemplete_positionTarget = createSelector(inventoryEditTempleteState, inventoryEditTemplete.positionTarget); 
export const inventoryEditTemplete_ownerId = createSelector(inventoryEditTempleteState, inventoryEditTemplete.ownerId);
export const inventoryEditTemplete_inventory = createSelector(inventoryEditTempleteState, inventoryEditTemplete.inventory); 

export const inventoryAttributesListTemplete_ids = createSelector(inventoryAttributesListTempleteState, inventoryAttributesListTemplete.ids);
export const inventoryAttributesListTemplete_upsertId = createSelector(inventoryAttributesListTempleteState, inventoryAttributesListTemplete.upsertId);
export const inventoryAttributesListTemplete_removeId = createSelector(inventoryAttributesListTempleteState, inventoryAttributesListTemplete.removeId);
 

export const {
    selectIds: selectInventoryIds,
    selectEntities: inventories,
    selectAll: selectAllInventories,
    selectTotal: selectTotalInventories,
} = inventoryEntities.adapter.getSelectors(inventoryEntitiesState);

export const {
    selectIds: selectInventoryAttributeIds,
    selectEntities: inventoryAttributes,
    selectAll: selectAllInventoryAttributes,
    selectTotal: selectTotalInventoryAttributes,
} = inventoryAttributeEntities.adapter.getSelectors(inventoryAttributeEntitiesState);

export const selectSelectedInventoryId = createSelector(inventoryEntitiesState, inventoryEntities.selectId);
export const selectSelectedInventory = createSelector(
    inventories,
    selectSelectedInventoryId,
    (entities, selectedId) => {
        return selectedId && entities[selectedId];
    }
);

export const selectCollectionInventoryIds = createSelector(
    inventoriesListTempleteState,
    inventoriesListTemplete.ids
);

export const selectInventoryCollection = createSelector(
    inventories,
    selectCollectionInventoryIds,
    (entities, ids) => {
        return ids
            .map(id => entities[id])
            .filter((inventory): inventory is Inventory => inventory != null);
    }
);
export const inventoryEntities_inventory = () => createSelector(
    inventories,
    (inventories, props) => {
        return inventories[props.id];
    }
);

export const isSelectedInventoryInCollection = createSelector(
    selectCollectionInventoryIds,
    selectSelectedInventoryId,
    (ids, selected) => {
        return !!selected && ids.indexOf(selected) > -1;
    }
);

export const inventoryViewPageMode = createSelector(
    inventoryViewPageState,
    inventoryViewPage.getMode
);


export const inventoriesListTemplete_inventories = () =>
    createSelector(
        inventories,
        inventoriesListTemplete_ids,
        inventoriesListTempleteState,
        (inventories, ids, state) => {
            if (ids && state.loaded) {
                return {
                    count: state.total,
                    inventories: ids.map(id => inventories[id]),
                    loaded: state.loaded && !state.loading 
                };
            } else return { inventories: [], loaded: state.loaded && !state.loading };
        }
    );
export const inventoryAttributesListTemplete_inventoryAttribute = () =>
    createSelector(
        inventoryAttributes,
        (inventoryAttributes, props) => {
            return inventoryAttributes[props.id];
        }
    );

export const inventoryAttributesListTemplete_inventoryAttributes = () =>
    createSelector(
        inventoryAttributes,
        inventoryAttributesListTemplete_ids,
        inventoryAttributesListTempleteState,
        (inventoryAttributes, ids, state) => {
            if (ids && state.loaded) {
                return {
                    count: state.total,
                    inventoryAttributes: ids.map(id => inventoryAttributes[id]),
                    loaded: state.loaded && !state.loading
                };
            } else return { inventoryAttributes: [], loaded: state.loaded && !state.loading };
        }
    );

