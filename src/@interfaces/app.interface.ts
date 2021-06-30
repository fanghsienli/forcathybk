import { BehaviorSubject } from "rxjs";

import { Icon } from"@models/icon";
export abstract class AppInterface {
    abstract participateId$: BehaviorSubject<string>;
    abstract leftIcons$: BehaviorSubject<Array<Icon>>;
    abstract anyLike$: BehaviorSubject<string>;
    abstract rights$: BehaviorSubject<Array<Icon>>;
    abstract inventoryMenus$: BehaviorSubject<Array<any>>;
    abstract host$: BehaviorSubject<string>;
}
