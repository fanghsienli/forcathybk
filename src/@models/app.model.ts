import { InventoryAttributeList } from './inventory';


export class Presentation {
    h3?: string;
    div?: string;
    p?: string;
    button?: string;
    buttons?: string[];
}

export class Layout {
    section: string;
    footer: boolean;
    header: boolean;
    mobile: boolean;
    detail: string;
    topright?: boolean;
}

export class Action {
    value: string;
}

export class SearchResult {
    title: string;
    type: string;
    subTitle: string;
    photoPath: string;
    navigateUrl: string;
}

export class Accordion {
    id: string;
    title: string; 
}


export class Grid {
    id: string;
    value: any;
    description: string;
    key: string;
    file: string;
    _value: any;
    _accordion: any;
    _select: boolean;
    detailLists: InventoryAttributeList[];
    attrs: any;
}
