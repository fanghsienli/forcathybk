import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { ItemViewPageActions, ItemsListTempleteActions, ItemAttributeEditTempleteActions, ItemEditTempleteActions } from "@actions/item";
import { Item } from "@entities/item";
export const featureKey = "item.entities";
/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Item> {
    selectedItemId: string | null;
    loaded: boolean;
    loading: boolean;
    ids: string[];
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>({
    selectId: (item: Item) => item.id,
    sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
    selectedItemId: null,
    loaded: false,
    loading: false,
    ids: []   
});

export const reducer = createReducer(
    initialState, 
  //  on(ItemEntitiesActions.addOne, (state, { item }) => adapter.addOne(item, state)),
    on(
        ItemsListTempleteActions.uploadSuccess,
        ItemsListTempleteActions.selectListSuccess,
        (state, { items }) => adapter.upsertMany(items, state)
    ),
    on(
        ItemViewPageActions.findSuccess,
        ItemEditTempleteActions.createSuccess,
        ItemEditTempleteActions.updateSuccess,
        (state, { item }) => adapter.upsertOne(item, state)
    )
);

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const selectId = (state: State) => state.selectedItemId;


