import { Inventory, InventoryAttribute } from "@entities/inventory";
import { FolderFile } from "@entities/entity"; 

export class InventoryAttributeList {
    attribute: string;
    value: string;
}
export class InventoryGrid {
    inventory: Inventory;
    photoQuantity: number;
    segmentationsQuantitySum: number;
    inventoryQuantity: number;
}

export class InventorySelect {
    id: string;
    no: string;
    description: string;
}
export class InventoryPosition {
    id: string;
    no: string; 
}

export class InventoryDetail {
    id: string;
    no: string;
    unit: string;
    value: number;
    photo: string;
    _take: number;
}

export class InventoryList {
    id: string;
    no: string;
    unit: string;
    value: number;
    photo: string;
    _take: number;
    itemId: string;
    item: string;
    position: string;
    positionId: string;
}

export class InventoryPrint {
    id: string; 
    _code: string; 
    no: string; 
}

export class InventorySave {
    inventory: Inventory;
    photos: FolderFile[];
    details: InventoryAttribute[];
}

export class InventoryMerge {
    sourceIds: string[];
    no: string;
}

export class InventoryPutdown {
    id: string;
    no: string;
    unit: string;
    value: number;
    recipeId: string;
    recipeValue: string;
    itemId: string;
    itemValue: string;
    file: string;
    _select: boolean;
    _value: number;
}
export class InventoryAccordion {
    id: string;
    no: string;
    recipeValue: string;
    recipeId: string;
    positionId: string;
    positionNo: string;
    positionRecipeValue: string;
    positionRecipeId: string;
    parentPositionId: string;
    parentPositionNo: string;
    parentPositionRecipeValue: string;
    parentPositionRecipeId: string;
    _open: boolean;
}

