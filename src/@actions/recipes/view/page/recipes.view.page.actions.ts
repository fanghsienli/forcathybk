import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";


export const setEmpty = createAction("[recipes.view.page] remove filter - all");