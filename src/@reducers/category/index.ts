import { Category } from "@entities/category";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action,
} from "@ngrx/store";
import * as categoryAttributeEditTemplete from "../categoryAttribute/edit/templete/categoryAttribute.edit.templete.reducer";
import * as categoryEntities from "./entities/category.entities.reducer";
import * as categoryViewPage from "./view/page/category.view.page.reducer";
import * as categoryAttributeEntities from "../categoryAttribute/entities/categoryAttribute.entities.reducer";
import * as categoryAttributesListTemplete from "../categoryAttributes/list/templete/categoryAttributes.list.templete.reducer";
import * as fromRoot from "@reducers";
import { Gen } from '../../@entities/entity';

export const featureKey = "category";

export interface CategoryState {
    [categoryEntities.featureKey]: categoryEntities.State;
    [categoryAttributesListTemplete.featureKey]: categoryAttributesListTemplete.State;
    [categoryAttributeEntities.featureKey]: categoryAttributeEntities.State;
    [categoryViewPage.featureKey]: categoryViewPage.State;
    [categoryAttributeEditTemplete.featureKey]: categoryAttributeEditTemplete.State;
}

export interface State extends fromRoot.State {
    [featureKey]: CategoryState;
}

export function reducers(state: CategoryState | undefined, action: Action) {
    return combineReducers({
        [categoryEntities.featureKey]: categoryEntities.reducer,
        [categoryViewPage.featureKey]: categoryViewPage.reducer,
        [categoryAttributeEntities.featureKey]: categoryAttributeEntities.reducer,
        [categoryAttributesListTemplete.featureKey]: categoryAttributesListTemplete.reducer,
        [categoryAttributeEditTemplete.featureKey]: categoryAttributeEditTemplete.reducer
    })(state, action);
}

export const categoryState = createFeatureSelector<State, CategoryState>(featureKey);
export const categoryEntitiesState = createSelector(categoryState, (state: CategoryState) => state["category.entities"]);
export const categoryViewPageState = createSelector(categoryState, (state: CategoryState) => state["category.view.page"]);
export const categoryAttributeEditTempleteState = createSelector(categoryState, (state: CategoryState) => state["categoryAttribute.edit.templete"]);

export const categoryAttributeEntitiesState = createSelector(categoryState, (state: CategoryState) => state["categoryAttribute.entities"]);
export const categoryAttributesListTempleteState = createSelector(categoryState, (state: CategoryState) => state["categoryAttributes.list.templete"]);

export const selectSelectedCategoryId = createSelector(categoryEntitiesState, categoryEntities.selectId);
export const categoryViewPage_upsertId = createSelector(categoryViewPageState, categoryViewPage.upsertId);
export const categoryAttributeEditTemplete_categoryAttribute = createSelector(categoryAttributeEditTempleteState, categoryAttributeEditTemplete.categoryAttribute);
export const categoryAttributesListTemplete_ids = createSelector(categoryAttributesListTempleteState, categoryAttributesListTemplete.ids);
export const categoryAttributesListTemplete_upsertId = createSelector(categoryAttributesListTempleteState, categoryAttributesListTemplete.upsertId);
export const categoryAttributesListTemplete_removeId = createSelector(categoryAttributesListTempleteState, categoryAttributesListTemplete.removeId);
export const {
    selectIds: selectCategoryIds,
    selectEntities: categories,
    selectAll: selectAllCategories,
    selectTotal: selectTotalCategories
} = categoryEntities.adapter.getSelectors(categoryEntitiesState);

export const {
    selectIds: selectItemAttributeIds,
    selectEntities: categoryAttributes,
    selectAll: selectAllItemAttributes,
    selectTotal: selectTotalItemAttributes
} = categoryAttributeEntities.adapter.getSelectors(categoryAttributeEntitiesState);


export const selectSelectedCategory = createSelector(
    categories,
    selectSelectedCategoryId,
    (entities, selectedId) => {
        return selectedId && entities[selectedId];
    }
);

export const categoryEntities_category = () => createSelector(
    categories,
    (categories, props) => {
        return categories[props.id];
    }
);

export const categoryAttributesListTemplete_categoryAttribute = () =>
    createSelector(
        categoryAttributes,
        (categoryAttributes, props) => {
            return categoryAttributes[props.id];
        }
    );

export const categoryAttributesListTemplete_categoryAttributes = () =>
    createSelector(
        categoryAttributes,
        categoryAttributesListTemplete_ids,
        categoryAttributesListTempleteState,
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
                    categoryAttributes: result.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
                    loaded: state.loaded && !state.loading
                };
            } else return { categoryAttributes: [], loaded: state.loaded && !state.loading };
        }
    );