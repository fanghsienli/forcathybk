import { Instance, Relation, Option, FolderFile } from "./entity";
import { Activity } from "./workflow";
import { Group } from "./group";
import { Item } from "./item";
import { Attribute } from './attribute';

//實例化Recipe
export class Inventory extends Instance {
    value: number;
    itemId: string;
    item: Item;
    itemValue: string;
    startDate: any;
    endDate: any;
    archivedDate: any;

    archivedById: string;
    archivedBy: Inventory;

    positionId: string;
    position: Position;
    _position: string;
    statusId: string;
    status: Option;
    photoId: string;
    photo: FolderFile;
    _photo: string;
    _take: number;
    _select: boolean;
    positionTargetId: string;
    positionTargetNo: string;
    _merge: boolean;
    constructor() {
        super();
        this.value = 1;
        this.position = new Position();
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }
}
export class Position extends Relation<Inventory, Inventory>//搭乘某載具有起訖時間 Target載具
{
    x: number;
    y: number;
    z: number;
    _action: string;
    _unchangeOwner: Inventory;
    constructor(ownerId?: string) {
        super();
        this.ownerId = ownerId;
        this.startDate = new Date();
    }
}

export class InventoryAttribute extends Relation<Inventory, Attribute>
{
    value: string;
    constructor(ownerId?: string, targetId?: string) {
        super();
        this.startDate = new Date();
        this.targetId = targetId;
        this.ownerId = ownerId;
    }
}

export class Custodian extends Relation<Inventory, Inventory>//持有人 Target檔案
{
    constructor() {
        super();
    }
}

export class Segmentation extends Relation<Inventory, Inventory>//產生另一批Inventory=> Target Inventory 原Inventory減量
{
    quantity: number;

    constructor(ownerId?: string, targetId?: string) {
        super();
        this.ownerId = ownerId;
        this.targetId = targetId;
    }
}

export class Relationship extends Relation<Inventory, Inventory>
{
    constructor() {
        super();
    }
}

export class InventoryGroup extends Relation<Inventory, Group>
{
    constructor(ownerId?: string, targetId?: string) {
        super();
        this.ownerId = ownerId;
        this.targetId = targetId;
    }
}

export class InventoryActivity extends Relation<Inventory, Activity>
{
}


export class Exchange extends Relation<Inventory, Inventory>
{
    value: number;
    constructor(ownerId?: string, targetId?: string) {
        super();
        this.ownerId = ownerId;
        this.targetId = targetId;
    }
}