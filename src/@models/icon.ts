export class Icon {
    value: string;
    content: string;
    badge: number;
    constructor(value?: string, content?: string, badge?:number) {
        this.value = value;
        this.content = content;
        this.badge = badge;
    }
}