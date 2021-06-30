import { createReducer, on } from "@ngrx/store";
import { InventoryViewPageActions, InventoryEditTempleteActions } from "@actions/inventory";
import { Inventory } from "@entities/inventory";

export const featureKey = "inventory.view.page";

export interface State {
    loading: boolean;
    mode: string;
    oldAction: string;
    pickup: Inventory;
    presentationAction: string;
    id: string;
    upsertId: string;
}

const initialState: State = {
    loading: false,
    mode: "",
    oldAction: "",
    pickup: null,
    presentationAction: "",
    id: "",
    upsertId:""
};

export const reducer = createReducer(
    initialState,
    on(InventoryViewPageActions.setId, (state, { id }) => {
        return {
            ...state,
            id
        };
    }),
    on(InventoryViewPageActions.setMode, (state, { mode }) => {
        return {
            ...state,
            mode: mode
        };
    }),
    on(InventoryViewPageActions.pickup, (state, { pickup, presentationAction }) => {
        return {
            ...state,
            pickup,
            presentationAction
        };
    }),
    on(
       // InventoryViewPageActions.findSuccess,
        InventoryEditTempleteActions.createSuccess,
        InventoryEditTempleteActions.updateSuccess,
        (state, { inventory }) => {
            return {
                ...state,
                upsertId: inventory.id,
                loading: false
            };
        }
    )
);

export const getLoading = (state: State) => state.loading;
export const getMode = (state: State) => state.mode;
export const upsertId = (state: State) => state.upsertId;

