import { Exchange } from "@entities/inventory";
import { Injectable } from "@angular/core";
import { HttpService } from "@services/http.service";

@Injectable({providedIn: "root"})
export class ExchangesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api = "api/Exchanges";
    }

    select(params: any) {
        return this.httpService.select<Exchange[]>(`${this.api}`, params, false);
    }
}
