import { Definition } from "./entity"; 
//實例化Recipe
export class Attribute extends Definition {
    level: number;
    valueType: string;
    valueNumber: number;
    itemIds: string;
    inventoryIds: string;
    categoryIds: string;
    _checked: boolean;
    constructor() {
        super();
        this.level = 1;
        this.valueType = "";
        this.valueNumber = 1;
        this.itemIds = "";
        this.inventoryIds = "";
        this.categoryIds = "";
        this.value = "";
        this.code = "";
    }
}