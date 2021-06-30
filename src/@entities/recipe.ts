import { FolderFile, Instance, Relation } from "./entity";
import { Item } from "./item";
import { Inventory } from "./inventory";

export class Recipe extends Instance {
    itemId: string;
    item: Item;
    photoId: string;
    photo: FolderFile;
    constructor(id?: string) {
        super();
        this.id = id;
    }
}

export class Input extends Instance {
    itemId: string;
    item: Item;
    value: number;
    constructor(id?: string) {
        super();
        this.id = id;
    }
}

export class Output extends Instance {
    itemId: string;
    item: Item;
    value: number;
    constructor(id?: string) {
        super();
        this.id = id;
    }
}

export class RecipeGroup extends Relation<Recipe, Inventory>
{
    constructor() {
        super();
    }
}