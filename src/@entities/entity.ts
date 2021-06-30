import { Inventory } from "./inventory";
import { Participate } from "./workflow";
export class Gen {
    static sortList(orderBy, result, descending) {
        if (orderBy && result !== []) {
            if (descending) result = result.sort((a, b) => {
                let param1 = a[orderBy];
                let param2 = b[orderBy];
                //如果兩個引數均為字串型別
                if (typeof param1 == "string" && typeof param2 == "string") {
                    return param1.localeCompare(param2);
                }
                //如果引數1為數字，引數2為字串
                if (typeof param1 == "number" && typeof param2 == "string") {
                    return -1;
                }
                //如果引數1為字串，引數2為數字
                if (typeof param1 == "string" && typeof param2 == "number") {
                    return 1;
                }
                //如果兩個引數均為數字
                if (typeof param1 == "number" && typeof param2 == "number") {
                    if (param1 > param2) return 1;
                    if (param1 == param2) return 0;
                    if (param1 < param2) return -1;
                }
            });
            else result = result.sort((a, b) => {
                let param1 = b[orderBy];
                let param2 = a[orderBy];
                //如果兩個引數均為字串型別
                if (typeof param1 == "string" && typeof param2 == "string") {
                    return param1.localeCompare(param2);
                }
                //如果引數1為數字，引數2為字串
                if (typeof param1 == "number" && typeof param2 == "string") {
                    return -1;
                }
                //如果引數1為字串，引數2為數字
                if (typeof param1 == "string" && typeof param2 == "number") {
                    return 1;
                }
                //如果兩個引數均為數字
                if (typeof param1 == "number" && typeof param2 == "number") {
                    if (param1 > param2) return 1;
                    if (param1 == param2) return 0;
                    if (param1 < param2) return -1;
                }
            });
        }
    }

    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static filterTest(target: any, fields: any, anyLike: string) {
        if (anyLike !== "") {
            let findResult: boolean = false;
            for (let field in fields) {
                let existedTarget = { ...target };
                let existedField = field;
                while (existedField.indexOf(".") !== -1) {
                    existedTarget = existedTarget[existedField.substr(0, existedField.indexOf("."))];
                    existedField = existedField.substr(existedField.indexOf(".") + 1);
                }
                let testString: string = existedTarget[existedField] ? existedTarget[existedField].toString() : "";
                if (testString !== "") {
                    if (testString.indexOf(anyLike) !== -1) findResult = true;
                }
                if (findResult) break;
            }
            return findResult;
        } else return true;
    }

    static newDate() {
        let date = new Date();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var hh = date.getHours();
        var mn = date.getMinutes();
        var ss = date.getSeconds();
        var ms = date.getMilliseconds();
        return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd,
        (hh > 9 ? '' : '0') + hh,
        (mn > 9 ? '' : '0') + mn,
        (ss > 9 ? '' : '0') + ss,
        (ms > 9 ? '' : '0') + ms
        ].join('');
    }

    static pad2(n) {  // alwaies returns a string
        return (n < 10 ? '0' : '') + n;
    }

    static newNo() {
        let d = new Date();
        return d.getFullYear().toString().substr(2) +
            this.pad2(d.getMonth() + 1) +
            this.pad2(d.getDate()) +
            this.pad2(d.getHours()) +
            this.pad2(d.getMinutes()) +
            this.pad2(d.getSeconds()) +
            this.pad2(d.getMilliseconds());
    }
}

export abstract class Base {
    id: string;
    createdById: string;
    createdBy: Inventory;
    createdDate: Date;
    _checked: boolean;
    constructor() {
        this.id = Gen.newGuid();
    }
}
export abstract class Definition extends Base {
    code: string;
    value: string;
    statusId: string;
    status: Option;
    createdGeneralId: string;
    constructor() {
        super();
    }
}

export class Detail<O> extends Base {
    ownerId: string;
    owner: O;
    constructor() {
        super();
    }
}

export abstract class Relation<O, T> extends Detail<O>
{
    targetId: string;
    target: T;
    startDate: any;
    endDate: any;
    archivedDate: any;
    archivedById: string;
    archivedBy: Inventory;
    createdParticipateId: string;
    createdParticipate: Participate;
    archivedParticipateId: string;
    archivedParticipate: Participate;
    constructor() {
        super(); 
    }
}

export class Instance extends Base {
    no: string;
    statusId: string;
    status: Option;
    constructor() {
        super();
    }
}

export class Option extends Definition {
    parentId: string;
    parent: Option;
    constructor() {
        super();
        this.statusId = "cd8d8758-aee1-4dc6-b8a8-860ba61c1ae5";
    }
}

export class FolderFile extends Base {
    targetId: string;
    target: File;
    constructor() {
        super();
    }
}
export class File extends Definition {
    path: string;
    url: string;
    _display: string;
    constructor() {
        super();
    }
}
