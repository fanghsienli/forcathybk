import { createAction, props } from "@ngrx/store";
import { Update, EntityMap, Predicate } from "@ngrx/entity"; 
import { Attribute } from "@entities/attribute";
 
export const loadAttributes = createAction("[attribute.entities] Load Attributes", props<{ attributes: Attribute[] }>());
export const addAttribute = createAction("[attribute.entities] Add Attribute", props<{ attribute: Attribute }>());
export const setAttribute = createAction("[attribute.entities] Set Attribute", props<{ attribute: Attribute }>());
export const upsertAttribute = createAction("[attribute.entities] Upsert Attribute", props<{ attribute: Attribute }>());
export const addAttributes = createAction("[attribute.entities] Add Attributes", props<{ attributes: Attribute[] }>());
export const upsertAttributes = createAction("[attribute.entities] Upsert Attributes", props<{ attributes: Attribute[] }>());
export const updateAttribute = createAction("[attribute.entities] Update Attribute", props<{ attribute: Update<Attribute> }>());
export const updateAttributes = createAction("[attribute.entities] Update Attributes", props<{ attributes: Update<Attribute>[] }>());
export const mapAttributes = createAction("[attribute.entities] Map Attributes", props<{ entityMap: EntityMap<Attribute> }>());
export const deleteAttribute = createAction("[attribute.entities] Delete Attribute", props<{ id: string }>());
export const deleteAttributes = createAction("[attribute.entities] Delete Attributes", props<{ ids: string[] }>());
export const deleteAttributesByPredicate = createAction("[attribute.entities] Delete Attributes By Predicate", props<{ predicate: Predicate<Attribute> }>());
export const clearAttributes = createAction("[attribute.entities] Clear Attributes");