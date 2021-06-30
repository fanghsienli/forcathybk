import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";

import {
    RecipesListTempleteActions, RecipeViewPageActions, RecipeEditTempleteActions
} from "@actions/recipe";
import { Inventory } from "@entities/inventory";

export const featureKey = "recipe.entities";

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Inventory> {}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Inventory> = createEntityAdapter<Inventory>({
    selectId: (recipe: Inventory) => recipe.id,
    sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({});

export const reducer = createReducer(
    initialState,
    on(
        RecipesListTempleteActions.selectListSuccess,
        (state, { recipes }) => adapter.upsertMany(recipes, state)
    ),
    on(

        RecipeEditTempleteActions.createSuccess,
        RecipeEditTempleteActions.updateSuccess,
        RecipeViewPageActions.findSuccess,
        RecipesListTempleteActions.create,
        RecipesListTempleteActions.update,
        (state, { recipe }) => adapter.upsertOne(recipe, state)
    ),
    on(
        RecipesListTempleteActions.remove,
        (state, { recipe }) => adapter.removeOne(recipe.id, state)
    )
);