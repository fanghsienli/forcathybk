import { RedirectCondition } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class RedirectConditionsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/RedirectConditions";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(redirectCondition: RedirectCondition) {
        return this.httpService.create(this.api, redirectCondition);
    }

    update(id: string, redirectCondition: RedirectCondition) {
        return this.httpService.update(`${this.api}/${id}`, redirectCondition);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<RedirectCondition>> {
        return this.httpService.select<Query<RedirectCondition>>(`${this.api}`, params, withRefresh);
    }
}
