import { Instance, Detail, Option, Relation } from "./entity";
import { Item } from "./item";
import { Inventory } from "./inventory";

export class WorkPlan extends Instance {
    itemId: string;
    item: Item;
    workPlanRecordId: string;
    workPlanRecord: WorkPlanRecord;
    startDate: string;//後端填寫
    startId: string;//後端填寫
    start: WorkEvent;//後端填寫
    endDate: string;//後端填寫
    endId: string;//後端填寫
    end: WorkEvent;//後端填寫

    constructor() {
        super();
    }
}

export class WorkPlanRecord extends Detail<WorkPlan>
{
    value: number;
    sort: number;

    constructor() {
        super();
    }
}

export class WorkOrder extends Detail<WorkPlan>
{
    itemId: string;
    item: Item;
    startDate: string;//後端填寫
    startId: string;//後端填寫
    start: WorkEvent;//後端填寫
    endDate: string;//後端填寫
    endId: string;//後端填寫
    end: WorkEvent;//後端填寫  
    archived: boolean;
    value: string;
    sort: number;

    constructor(ownerId: string) {
        super();
        this.ownerId = ownerId;
    }
}

export class WorkEvent extends Detail<WorkOrder>
{
    sort: string;
    typeId: string;
    type: Option;

    constructor(ownerId: string, typeId: string) {
        super();
        this.ownerId = ownerId;
        this.typeId = typeId;
    }
}

export class WorkEventInventory extends Relation<WorkEvent, Inventory>//Position在Station上
{
    sort: number;
    typeId: string;//Input(Position=Station), Output(Position=Station), Pickup(Position=Person)
    type: Option;

    constructor(ownerId: string, typeId: string) {
        super();
        this.ownerId = ownerId;
        this.typeId = typeId;
    }
}


export class StationRecord extends Relation<Inventory, WorkEvent>
{
    sort: number;
    constructor(ownerId: string, targetId: string) { 
        super();
        this.ownerId = ownerId;
        this.targetId = targetId;
    }
} 