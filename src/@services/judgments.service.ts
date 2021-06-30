import { Judgment } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class JudgmentsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Judgments";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(judgment: Judgment) {
        return this.httpService.create(this.api, judgment);
    }

    update(id: string, judgment: Judgment) {
        return this.httpService.update(`${this.api}/${id}`, judgment);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Judgment>> {
        return this.httpService.select<Query<Judgment>>(`${this.api}`, params, withRefresh);
    }
}
