import { Relation, Base, Detail, Definition } from"./entity";

export class Group extends Definition {
    parent: Group;
    parentId: string;
    constructor() {
        super();
    }
}

//可用功能
export class FunctionGroup extends Relation<Function, Group>
{
    constructor() {
        super();
    }
}

/// <summary>
/// 可用功能
/// </summary>
export class Function extends Base {
}

//群組規則
export class Rule extends Detail<Group>
{
    constructor() {
        super();
    }
}

//選單
export class Menu extends Definition
{
    parent: Menu;
    parentId: string;
    value: string;
    code: string;
    functionId: string;
    function: Function;
    constructor() {
        super();
    }
}