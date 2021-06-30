import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";


export const setEmpty = createAction("[workOrders.view.page] remove filter - all");