import { createReducer, on } from "@ngrx/store";
import {
    RecipeViewPageActions, RecipeEditTempleteActions
} from "@actions/recipe";

import { RecipesListTempleteActions } from "@actions/recipe";
import { Inventory } from "@entities/inventory";
import { ItemViewPageActions } from "@actions/item";
export const featureKey = "recipes.list.templete";

export interface State {
    id: string;
    recipe: Inventory;
    presentationAction: string;
    loaded: boolean;
    loading: boolean;
    ids: string[];
    anyLike: string;
    orderBy: string;
    descending: boolean;
    pageIndex: number;
    pageSize: number;
    itemId: string | null;
    recipeId: string | null;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    id: "",
    recipe: null,
    presentationAction: "",
    loaded: false,
    loading: false,
    ids: [],
    anyLike: "",
    orderBy: "",
    descending: false,
    pageIndex: 1,
    pageSize: 15,
    itemId: "",
    recipeId: "",
    upsertId: null,
    removeId: null,
    total: 0
};


export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            itemId: id,
            recipeId: null
        };
    }),
    on(RecipeEditTempleteActions.createSuccess,
        RecipeEditTempleteActions.updateSuccess,
        RecipesListTempleteActions.removeFailure,
        (state, { recipe }) => {
            if (state.ids.indexOf(recipe.id) > -1) {
                return {
                    ...state,
                    upsertId: recipe.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, recipe.id],
                upsertId: recipe.id
            };
    }),
    on(RecipesListTempleteActions.removeSuccess,//RecipeEditTempleteActions.createFailure,
        (state, { recipe }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== recipe.id),
                removeId: recipe.id
            });
        }),
    on(RecipeViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            categoryId: id
        };
    }),
    on(RecipesListTempleteActions.goToEdit, (state, { id }) => ({
        ...state,
        id: id
    })),
    on(RecipesListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(RecipesListTempleteActions.selectListSuccess, (state, { recipes, total }) => {
        return {
            ...state,
            loading: false,
            ids: recipes.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(RecipesListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(RecipesListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(RecipesListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(RecipesListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(RecipesListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        pageIndex: 1,
        loaded: false,
        descending
    })),
    on(RecipesListTempleteActions.editRecipe, (state, { recipe }) => {
        return {
            ...state,
            recipe
        };
    }),
    on(RecipesListTempleteActions.newRecipe, (state) => {
        return {
            ...state,
            recipe: null
        };
    })
);

export const getLoading = (state: State) => state.loading;
export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const ids = (state: State) => state.ids;
export const orderBy = (state: State) => state.orderBy;
export const total = (state: State) => state.total;
export const recipe = (state: State) => state.recipe;