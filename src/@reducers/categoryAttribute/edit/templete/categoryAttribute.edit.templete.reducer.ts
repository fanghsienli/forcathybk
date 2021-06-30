import { createReducer, on } from "@ngrx/store";
import { CategoryAttributeEditTempleteActions, CategoryViewPageActions, CategoryAttributesListTempleteActions } from "@actions/category";
import { CategoryAttribute } from "@entities/category";

export const featureKey = "categoryAttribute.edit.templete";

export interface State {
    categoryAttribute: CategoryAttribute;
    ownerId: string;
}

const initialState: State = {
    categoryAttribute: null,
    ownerId:""
};


export const reducer = createReducer(
    initialState,
    on(CategoryViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            ownerId: id,
            categoryAttribute:null
        };
    }),
    on(CategoryAttributesListTempleteActions.editCategoryAttribute, (state, { categoryAttribute }) => {
        return {
            ...state,
            categoryAttribute
        };
    }),
    on(CategoryAttributesListTempleteActions.Attribute, (state) => {
        return {
            ...state,
            categoryAttribute: null
        };
    }),
    on(CategoryAttributeEditTempleteActions.create, (state, { categoryAttribute }) => {
        return {
            ...state,
            categoryAttribute
        };
    }),
    on(CategoryAttributeEditTempleteActions.update, (state, { categoryAttribute }) => {
        return {
            ...state,
            categoryAttribute
        };
    })
); 


export const categoryAttribute = (state: State) => state.categoryAttribute;