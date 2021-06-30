import { createAction, props } from "@ngrx/store";

import { Category } from "@entities/category";

export const loadCategory = createAction(
    "[Category Exists Guard] Load Category",
    props<{ category: Category }>()
);
