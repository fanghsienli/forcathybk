import { Inventory } from"@entities/inventory";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
@Injectable({providedIn: "root"})
export class SettingsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Settings/";
    }

    select() {
        return this.httpService.select(this.api);
    }
}
