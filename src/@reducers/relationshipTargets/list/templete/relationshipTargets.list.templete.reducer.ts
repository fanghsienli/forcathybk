import { createReducer, on } from "@ngrx/store";
import { RelationshipTargetsListTempleteActions, RelationshipTargetEditTempleteActions } from "@actions/relationshipTarget";
import { Attribute } from "@entities/attribute";
export const featureKey = "relationshipTargets.list.templete";

export interface State {
    id: string;
    presentationAction: string;
    loaded: boolean;
    loading: boolean;
    ids: string[];
    anyLike: string | null;
    orderBy: string;
    descending: boolean;
    pageIndex: number;
    pageSize: number;
    ownerId: string;
    attribute: Attribute,
    attributeId: string;
    upsertId: string;
    removeId: string;
    total: number;
}

const initialState: State = {
    id: "",  
    presentationAction: "",
    loaded: false,
    loading: false,
    ids: [],
    anyLike: "",
    orderBy: "",
    descending: false,
    pageIndex: 1,
    pageSize: 15,
    ownerId: "",
    attribute:null,
    attributeId: "",
    upsertId: null,
    removeId: null,
    total: 0
};


export const reducer = createReducer(
    initialState,
    on(RelationshipTargetsListTempleteActions.setConditions, (state, { ownerId, attributeId }) => {
        return {
            ...state,
            ownerId,
            attributeId
        };
    }),
    on(RelationshipTargetsListTempleteActions.setAttribute, (state, { attribute }) => {
        return {
            ...state,
            attribute
        };
    }),
    on(
        RelationshipTargetsListTempleteActions.removeFailure,
        RelationshipTargetEditTempleteActions.createSuccess,
        RelationshipTargetEditTempleteActions.updateSuccess,
        (state, { relationshipTarget }) => {
            if (state.ids.indexOf(relationshipTarget.id) > -1) {
                return {
                    ...state,
                    upsertId: relationshipTarget.id
                }
            }
            return {
                ...state,
                ids: [...state.ids, relationshipTarget.id],
                upsertId: relationshipTarget.id
            };
        }),
    on(RelationshipTargetsListTempleteActions.removeSuccess,//RelationshipTargetEditTempleteActions.createFailure,
        (state, { relationshipTarget }) => {
            return ({
                ...state,
                ids: state.ids.filter(x => x !== relationshipTarget.id),
                removeId: relationshipTarget.id
            });
        }),  
    on(RelationshipTargetsListTempleteActions.selectList, (state) => {
        return {
            ...state,
            loading: true,
            error: ""
        };
    }),
    on(RelationshipTargetsListTempleteActions.selectListSuccess, (state, { relationshipTargets, total }) => {
        return {
            ...state,
            loading: false,
            ids: relationshipTargets.map(x => x.id),
            loaded: true,
            total
        };
    }),
    on(RelationshipTargetsListTempleteActions.selectListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(RelationshipTargetsListTempleteActions.setPageSize, (state, { pageSize }) => {
        return ({
            ...state,
            pageSize
        });
    }),
    on(RelationshipTargetsListTempleteActions.setPageIndex, (state, { pageIndex }) => {
        return ({
            ...state,
            pageIndex,
            loaded: false
        });
    }),
    on(RelationshipTargetsListTempleteActions.setFilter, (state, { anyLike }) => ({
        ...state,
        anyLike,
        pageIndex: 1,
        loaded: false
    })),
    on(RelationshipTargetsListTempleteActions.setConditions, (state, { attributeId,ownerId   }) => ({
        ...state,
        attributeId,
        ownerId,
        loaded: false
    })),    
    on(RelationshipTargetsListTempleteActions.setSort, (state, { orderBy, descending }) => ({
        ...state,
        orderBy,
        pageIndex: 1,
        loaded: false,
        descending
    }))
);


export const upsertId = (state: State) => state.upsertId;
export const removeId = (state: State) => state.removeId;
export const ids = (state: State) => state.ids;
export const orderBy = (state: State) => state.orderBy;
export const total = (state: State) => state.total;