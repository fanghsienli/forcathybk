import { createReducer, on } from "@ngrx/store";
import { ItemAttributeEditTempleteActions, ItemViewPageActions, ItemAttributesListTempleteActions } from "@actions/item";
import { ItemAttribute } from "@entities/item";

export const featureKey = "itemAttribute.edit.templete";

export interface State {
    itemAttribute: ItemAttribute;
    ownerId: string;
}

const initialState: State = {
    itemAttribute: null,
    ownerId:""
};


export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.find, (state, { id }) => {
        return {
            ...state,
            ownerId: id,
            itemAttribute:null
        };
    }),
    on(ItemAttributesListTempleteActions.editItemAttribute, (state, { itemAttribute }) => {
        return {
            ...state,
            itemAttribute
        };
    }),
    on(ItemAttributesListTempleteActions.Attribute, (state) => {
        return {
            ...state,
            itemAttribute: null
        };
    }),
    on(ItemAttributeEditTempleteActions.create, (state, { itemAttribute }) => {
        return {
            ...state,
            itemAttribute
        };
    }),
    on(ItemAttributeEditTempleteActions.update, (state, { itemAttribute }) => {
        return {
            ...state,
            itemAttribute
        };
    })
); 


export const itemAttribute = (state: State) => state.itemAttribute;