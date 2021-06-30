import { Step } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class StepsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Steps";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(step: Step) {
        return this.httpService.create(this.api, step);
    }

    update(id: string, step: Step) {
        return this.httpService.update(`${this.api}/${id}`, step);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any) {
        return this.httpService.select(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Step>> {
        return this.httpService.select<Query<Step>>(`${this.api}`, params, withRefresh);
    }
}
