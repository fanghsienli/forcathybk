import { Definition, Detail, FolderFile, Option, Relation } from "./entity";
import { Category } from "./category";
import { Attribute } from "./attribute";
import { Inventory } from './inventory';

export class Item extends Definition { 
    audited: boolean[]; 
    description: string;
    photoId: string;
    photo: string;
    deletable: boolean;
    unitType: Inventory;
    unitTypeId: string;
    unit: Inventory;
    unitId: string;
    default: Inventory;
    defaultId: string;
    constructor() {
        super();
        this.code = "";
        this.value = "";
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
        this.description = "";
    }
} 
export class Recipe extends Definition
{
    status: Option;
    statusId: string;
    photoId: string;
    photo: FolderFile;
    constructor() {
        super();
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }
}

export class Procedure extends Detail<Recipe>
{
    ingredientId: string;
    ingredient: Recipe;
    quantity: number;
    constructor() {
        super();
    }
}
export class ItemAttribute extends Relation<Item, Attribute> {
    _conditions: any[];
    constructor() {
        super();     
        this.target = { ...new Attribute() };
    }
}
export class ItemCategory extends Relation<Item, Category>
{
    status: Option;
    statusId: string;
    constructor(ownerId?: string, target?: Category) {
        super();
        this.ownerId = ownerId;
        this.target = target;
        this.targetId = this.target.id;
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }
}

 

export class ItemGroup extends Relation < Attribute, Inventory >
{
    constructor() {
        super();
    }
}