import { createAction, props } from "@ngrx/store";
import { Item } from "@entities/item";


export const setEmpty = createAction("[workPlans.view.page] remove filter - all");