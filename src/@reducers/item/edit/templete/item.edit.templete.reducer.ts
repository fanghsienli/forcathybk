import { createReducer, on } from "@ngrx/store";
import { ItemEditTempleteActions, ItemsListTempleteActions, ItemViewPageActions } from "@actions/item";
import { Item } from "@entities/item";

export const featureKey = "item.edit.templete";

export interface State {
    item: Item;
    ownerId: string;
}

const initialState: State = {
    item: null,
    ownerId:""
};


export const reducer = createReducer(
    initialState,
    on(ItemViewPageActions.editItem,
        ItemsListTempleteActions.editItem, (state, { item }) => {
        return {
            ...state,
            item
        };
    }),
    on(ItemsListTempleteActions.newItem, (state) => {
        return {
            ...state,
            item: null
        };
    }),
    on(ItemEditTempleteActions.create, (state, { item }) => {
        return {
            ...state,
            item
        };
    }),
    on(ItemEditTempleteActions.update, (state, { item }) => {
        return {
            ...state,
            item
        };
    })
); 


export const item = (state: State) => state.item;