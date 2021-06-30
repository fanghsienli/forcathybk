import { Inventory } from"@entities/inventory";
import { Group } from"@entities/group";
export class Setting {
    ad: string;
    profile: Inventory;
    groups: Group[];
    ip: string;
}