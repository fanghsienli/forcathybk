import { FolderFile } from "@entities/entity";

export class FileSave {
    photos: FolderFile[];
}

export class PostPosition {
    target: any;
    action: string;
}

export class OptionSelect {
    id: string;
    code: string;
    value: string;
}