import { Inventory } from "@entities/inventory";
import {
    createSelector,
    createFeatureSelector,
    combineReducers,
    Action
} from "@ngrx/store";
import * as recipeEditTemplete from "../recipe/edit/templete/recipe.edit.templete.reducer";
import * as recipesListTemplete from "../recipes/list/templete/recipes.list.templete.reducer";
import * as recipeEntities from "./entities/recipe.entities.reducer";
import * as recipeViewPage from "./view/page/recipe.view.page.reducer";
import * as fromRoot from "@reducers";

export const featureKey = "recipe";

export interface RecipeState {
    [recipeEntities.featureKey]: recipeEntities.State;
    [recipesListTemplete.featureKey]: recipesListTemplete.State;
    [recipeViewPage.featureKey]: recipeViewPage.State;
    [recipeEditTemplete.featureKey]: recipeEditTemplete.State; 
}

export interface State extends fromRoot.State {
    [featureKey]: RecipeState;
}

export function reducers(state: RecipeState | undefined, action: Action) {
    return combineReducers({
        [recipeEntities.featureKey]: recipeEntities.reducer,
        [recipesListTemplete.featureKey]: recipesListTemplete.reducer,
        [recipeViewPage.featureKey]: recipeViewPage.reducer,
        [recipeEditTemplete.featureKey]: recipeEditTemplete.reducer
    })(state, action);
}

export const recipesState = createFeatureSelector<State, RecipeState>(featureKey);
export const recipeState = createFeatureSelector<State, RecipeState>(featureKey);
export const recipeEntitiesState = createSelector(recipeState, (state: RecipeState) => state["recipe.entities"]);
export const recipeViewPageState = createSelector(recipeState, (state: RecipeState) => state["recipe.view.page"]);
export const recipesListTempleteState = createSelector(recipeState, (state: RecipeState) => state["recipes.list.templete"]);
export const recipeEditTempleteState = createSelector(recipeState, (state: RecipeState) => state["recipe.edit.templete"]);

export const recipeViewPage_id = createSelector(recipeViewPageState, recipeViewPage.id);
export const recipeViewPage_attributeIds = createSelector(recipeViewPageState, recipeViewPage.attributeIds);
export const recipeEditTemplete_recipe = createSelector(recipeEditTempleteState, recipeEditTemplete.recipe);
export const recipesListTemplete_ids = createSelector(recipesListTempleteState, recipesListTemplete.ids);
export const recipesListTemplete_upsertId = createSelector(recipesListTempleteState, recipesListTemplete.upsertId);
export const recipesListTemplete_removeId = createSelector(recipesListTempleteState, recipesListTemplete.removeId);
export const recipesListTemplete_total = createSelector(recipesListTempleteState, recipesListTemplete.total);

export const {
    selectIds: selectRecipeIds,
    selectEntities: selectRecipeEntities,
    selectAll: selectAllRecipes,
    selectTotal: selectTotalRecipes,
} = recipeEntities.adapter.getSelectors(recipeEntitiesState);

export const selectCollectionRecipeIds = createSelector(
    recipesListTempleteState,
    recipesListTemplete.ids
);

export const recipeViewPage_recipe = createSelector(
    selectRecipeEntities,
    recipeViewPage_id,
    (entities, id) => {
        return entities[id];
    }
);

export const selectRecipeCollection = createSelector(
    selectRecipeEntities,
    selectCollectionRecipeIds,
    (entities, ids) => {
        return ids
            .map(id => entities[id])
            .filter((recipe): recipe is Inventory => recipe != null);
    }
);

export const recipeViewPageMode = createSelector(
    recipeViewPageState,
    recipeViewPage.getMode
);

export const getRecipes = () => createSelector(
    selectRecipeEntities,
    recipesListTemplete_ids,
    recipesListTempleteState,
    (recipes, ids, state, props) => {
        if (ids && state.loaded) {
            let anyLike = state.anyLike.trimStart().trimEnd();
            let result = ids.map(id => recipes[id]);
            return {
                anyLike: anyLike,
                count: state.total,
                recipes: result,
                loaded: state.loaded && !state.loading
            };
        } else return { recipes: [], loaded: state.loaded && !state.loading };
    }
);