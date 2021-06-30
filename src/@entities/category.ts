import { Definition, Option, Relation } from "./entity";
import { Attribute } from "./attribute";

export class Category extends Definition
{
    parent: Category;
    parentId: string;
    value: string;
    status: Option;
    statusId: string;
    constructor(value?: string) {
        super();
        this.value = value;
        this.status = new Option();
        this.status.value = "新";
        this.status.id = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }
}

export class CategoryAttribute extends Relation<Category, Attribute> { 
    _conditions: any[];
    constructor() {
        super();
        this.target = { ...new Attribute() };
    }
}

