import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";


export const setEmpty = createAction("[items.view.page] remove filter - all");