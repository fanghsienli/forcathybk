import { createReducer, on } from "@ngrx/store";
import { PresentationActions } from "@actions";
import { ItemViewPageActions, ItemAttributesListTempleteActions, ItemsListTempleteActions } from "@actions/item";
import { InventoryViewPageActions, InventoriesListTempleteActions } from "@actions/inventory";
import { ProfileViewPageActions } from "@actions/profile";
import { RecipeViewPageActions, RecipesListTempleteActions } from "@actions/recipe";
import { RelationshipTargetsListTempleteActions } from "@actions/relationshipTarget";
import { WorkOrderEventsListTempleteActions, WorkOrderViewPageActions, WorkOrdersListTempleteActions } from "@actions/workOrder";
export const featureKey = "presentation";


export interface State {
    type: string;
    title: string;
    message: any;
    buttons: any[];
    width: string;
    item: any;
    limit: number;
    workOrder: any;
    station: any;
}

const initialState: State = {
    type: "",
    title: "",
    message: "",
    buttons: [],
    width: "",
    item: null,
    limit: 0,
    workOrder: null,
    station:null
};


export const reducer = createReducer(
    initialState,
    on(PresentationActions.close,
        PresentationActions.setEmpty,
        () => initialState),
    on(//PresentationActions.more,
        WorkOrdersListTempleteActions.more,
        WorkOrderViewPageActions.more,
        WorkOrderEventsListTempleteActions.more,
        RelationshipTargetsListTempleteActions.more,
        ItemsListTempleteActions.more,
        InventoriesListTempleteActions.more,
        ProfileViewPageActions.more,
        RecipesListTempleteActions.more,
        RecipeViewPageActions.more,
        ItemViewPageActions.more,
        ItemAttributesListTempleteActions.more,
        InventoryViewPageActions.more,
        (state, { type, buttons }) => {
            return {
                ...state,
                type: type,
                buttons: buttons,
                title: "more",
                width: "240px"
            };
        }),
    on(PresentationActions.open, (state, { title, width }) => {
        return {
            ...state,
            title,
            width
        };
    }),
    on(WorkOrderEventsListTempleteActions.pickup, (state, { limit, item, workOrder }) => {
        return {
            ...state,
            title: "pickup",
            limit,
            item,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.resumeStation, (state, { station, workOrder }) => {
        return {
            ...state,
            title: "resumeStation",
            station,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.startStation, (state, { station, workOrder }) => {
        return {
            ...state,
            title: "startStation",
            station,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.pauseStation, (state, { station, workOrder }) => {
        return {
            ...state,
            title: "pauseStation",
            station,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.stopStation, (state, { station, workOrder }) => {
        return {
            ...state,
            title: "stopStation",
            station,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.startup, (state, { limit, item, workOrder }) => {
        return {
            ...state,
            title: "startup",
            limit,
            item,
            width: "365px",
            workOrder
        };
    }),
    on(WorkOrderEventsListTempleteActions.inspection, (state, { item, workOrder }) => {
        return {
            ...state,
            title: "inspection",
            limit: 0,
            item,
            width: "365px",
            workOrder
        };
    }),
    on(PresentationActions.message, (state, { message }) => {
        return {
            ...state,
            title: "message",
            message
        };
    })
);

export const type = (state: State) => state.type;
export const buttons = (state: State) => state.buttons;
export const title = (state: State) => state.title;
export const width = (state: State) => state.width;
export const message = (state: State) => state.message;
export const limit = (state: State) => state.limit;
export const item = (state: State) => state.item;
export const station = (state: State) => state.station;
export const workOrder = (state: State) => state.workOrder;