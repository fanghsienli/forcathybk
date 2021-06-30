import { createReducer, on } from "@ngrx/store";
import { RecipeViewPageActions } from "@actions/recipe";
import { Item } from "@entities/item";
import { ItemViewPageActions } from '../../../../@actions/item';

export const featureKey = "recipe.view.page";

export interface State {
    id: string;
    loading: boolean;
    mode: string;
    selectedAttributeId: string;
    attributeIds: string[];
}

const initialState: State = {
    loading: false,
    mode: "",
    id: "",
    selectedAttributeId: "",
    attributeIds: []
};


export const reducer = createReducer(
    initialState,
    on(RecipeViewPageActions.setMode, (state, { mode }) => {
        return {
            ...state,
            mode: mode
        };
    }),
    on(RecipeViewPageActions.selectAttributesSuccess, (state, { attributes }) => {
        return {
            ...state,
            attributeIds: attributes.map(x=>x.id)
        };
    }),
    on(RecipeViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            id,
            itemId: null
        };
    })
);
export const attributeIds = (state: State) => state.attributeIds;
export const getLoading = (state: State) => state.loading;
export const getMode = (state: State) => state.mode;
export const id = (state: State) => state.id;