import { createReducer, on } from "@ngrx/store";
import { RecipeEditTempleteActions, RecipesListTempleteActions } from "@actions/recipe";
import { Inventory, InventoryAttribute } from "@entities/inventory";

export const featureKey = "recipe.edit.templete";

export interface State {
    targetValue: string;
    attributeId: string;
    ownerId: string;
    must: boolean;
    id: string;
    level: number;
    valueType: string;
    valueNumber: number;
    itemIds: string;
    recipeIds: string;
    categoryIds: string;
    recipe: Inventory;
    recipeWithAttributes: any;
}

const initialState: State = {
    targetValue: "",
    attributeId: "",
    ownerId: "",
    must: false,
    id: "",
    level: 1,
    valueType: "",
    valueNumber: 1,
    itemIds: "",
    recipeIds: "",
    categoryIds: "",
    recipe: null,
    recipeWithAttributes: null
};


export const reducer = createReducer(
    initialState,
    on(RecipeEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
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
    }),
    on(RecipeEditTempleteActions.create, (state, { recipeWithAttributes }) => {
        return {
            ...state,
            recipeWithAttributes
        };
    }),
    on(RecipeEditTempleteActions.update, (state, { recipeWithAttributes }) => {
        return {
            ...state,
            recipeWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const recipe = (state: State) => state.recipe;