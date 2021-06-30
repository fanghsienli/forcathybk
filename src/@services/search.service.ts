import { Inventory } from"@entities/inventory";
import { Injectable } from"@angular/core";
import { HttpService } from "@services/http.service";
import { SearchResult } from '../@models/app.model';

@Injectable({providedIn: "root"})
export class SearchService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Search";
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select<SearchResult[]>(`${this.api}`, params, withRefresh);
    }

    selectConditions(params: any) {
        return this.httpService.select<SearchResult[]>(`${this.api}/Conditions`, params, false);
    }
}
