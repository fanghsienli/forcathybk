import { createReducer, on } from "@ngrx/store";
import { CategoryViewPageActions } from "@actions/category";
import { Category } from "@entities/category";

export const featureKey = "category.view.page";

export interface State {
    loading: boolean;
    mode: string;
    oldAction: string;
    pickup: Category;
    presentationAction: string;
    upsertId: string;
}

const initialState: State = {
    loading: false,
    mode: "",
    oldAction: "",
    pickup: null,
    presentationAction: "",
    upsertId: ""
};

export const reducer = createReducer(
    initialState,
    on(CategoryViewPageActions.addCategory,
        CategoryViewPageActions.importCategories,
        CategoryViewPageActions.printCategories,
        CategoryViewPageActions.exportCategories,
        CategoryViewPageActions.enable,
        CategoryViewPageActions.disable,
        CategoryViewPageActions.edit,
        CategoryViewPageActions.remove, (state, { oldAction }) => ({
            ...state,
            oldAction: oldAction
        })),
    on(CategoryViewPageActions.setMode, (state, { mode }) => {
        return {
            ...state,
            mode: mode
        };
    }),
    on(CategoryViewPageActions.find, (state, { id }) => {
        return {
            ...state,
           id
        };
    })
);

export const getLoading = (state: State) => state.loading;
export const getMode = (state: State) => state.mode;
export const upsertId = (state: State) => state.upsertId;
