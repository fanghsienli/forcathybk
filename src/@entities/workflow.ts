import { Definition, Relation, Detail, Option, Instance } from "./entity";
import { Group } from "./group";
import { Inventory } from "./inventory";


export class WorkFlow extends Definition {
    firstId: string;
    first: Step;
    finalId: string;
    final: Step;
    constructor(id?: string, firstId?: string) {
        super();
        this.id = id;
        this.firstId = firstId;
    }
}

export class Step extends Detail<WorkFlow>
{
    view: string;
    component: string;
    constructor() {
        super();
    }
}
export class StepGroup extends Relation<Step, Group>
{
    constructor() {
        super();
    }
}

export class Redirect extends Relation<Step, Step>
{
    trueRatio: number;//(=100)=AND (>0)=OR
    _errorirectConditions: RedirectCondition[];
    constructor() {
        super();
    }
}

export class RedirectCondition extends Relation<Redirect, Condition>
{
    sort: number;
    constructor() {
        super();
    }
}


export class StepRelationship extends Relation<Step, Option>//這裡的Option是Of的關係 例如主管 或 代理人
{
    ofId: string;
    of: Option;//開單者 或 前一關卡者
    constructor() {
        super();
    }
}


export class Activity extends Relation<Process, Step>
{
    archivedParticipate: Participate;
    archivedParticipateId: string;
    previousId: string;
    previous: Activity;
    nextId: string;
    next: Activity;
    componentId: string;
    _ignore: boolean;
    constructor() {
        super();
    }
}

export class Condition extends Definition {
    constructor() {
        super();

    }
}

export class Participate extends Detail<Activity>
{
    startDate: Date;
    endDate: Date;
    archivedDate: Date;
    archivedById: string;
    archivedBy: Inventory;
    participantId: string;
    participant: Inventory;
    redirectId: string;
    redirect: Redirect;
    actionId: string;
    action: Option;
    constructor(ownerId?: string, participantId?: string) {
        super();
        this.startDate = new Date();
        this.ownerId = ownerId;
        this.participantId = participantId;
    }
}

export class Judgment extends Detail<Participate>
{
    conditionId: string;
    condition: Condition;
    constructor() {
        super();
    }
}

export class Process extends Instance {
    previousId: string;
    previous: Activity;
    currentId: string;
    current: Activity;
    workFlowId: string;
    workFlow: WorkFlow;
    parentId;
    parent: Process;
    _activitiesCount: number;
    reEdit: number;
    constructor(workFlow?: WorkFlow) {
        super();
        this.reEdit = 1;
        this.workFlow = workFlow;
        this.workFlowId = workFlow.id;
    }
}