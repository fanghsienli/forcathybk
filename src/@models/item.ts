import { Item } from "@entities/item";
import { FolderFile } from "@entities/entity";

export class ItemDetail {
    id: string;
    photo: string;
    value: string;
    deletable: boolean;
    status: string;
    description: string;
}

export class ItemSave {
    item: Item;
    categoryValues: string[];
    photos: FolderFile[];
}

export class ItemUpload {
    code: string;
    value: string;
    description: string;
}

export class ItemSelect {
    id: string;
    code: string;
    value: string;
}

export class ItemGrid {
    item: Item;
    recipeDraftQuantity: number;
    recipeQuantity: number;
    inventoryQuantity: number;
    photoQuantity: number;
}

export class ItemAttributeCheckbox {
    _checked: boolean
    value: string;
}

export class ItemList {
    id: string;
    photo: string;
    value: string;
    description: string;
    _checked: boolean;
    deletable: boolean;
}