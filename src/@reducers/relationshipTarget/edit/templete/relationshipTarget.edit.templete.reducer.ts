import { createReducer, on } from "@ngrx/store";
import { RelationshipTargetEditTempleteActions, RelationshipTargetsListTempleteActions } from "@actions/relationshipTarget";
import { Inventory, InventoryAttribute } from "@entities/inventory";

export const featureKey = "relationshipTarget.edit.templete";

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
    relationshipTargetIds: string;
    categoryIds: string;
    relationshipTarget: Inventory;
    relationshipTargetWithAttributes: any;
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
    relationshipTargetIds: "",
    categoryIds: "",
    relationshipTarget: null,
    relationshipTargetWithAttributes: null
};


export const reducer = createReducer(
    initialState,
    on(RelationshipTargetEditTempleteActions.setConditions, (state, { attributeId, ownerId }) => {
        return {
            ...state,
            attributeId,
            ownerId
        };
    }),
    on(RelationshipTargetsListTempleteActions.editRelationshipTarget, (state, { relationshipTarget }) => {
        return {
            ...state,
            relationshipTarget
        };
    }),
    on(RelationshipTargetsListTempleteActions.newRelationshipTarget, (state) => {
        return {
            ...state,
            relationshipTarget: null
        };
    }),
    on(RelationshipTargetEditTempleteActions.create, (state, { relationshipTargetWithAttributes }) => {
        return {
            ...state,
            relationshipTargetWithAttributes
        };
    }),
    on(RelationshipTargetEditTempleteActions.update, (state, { relationshipTargetWithAttributes }) => {
        return {
            ...state,
            relationshipTargetWithAttributes
        };
    })
);
export const ownerId = (state: State) => state.ownerId
export const attributeId = (state: State) => state.attributeId;
export const relationshipTarget = (state: State) => state.relationshipTarget;