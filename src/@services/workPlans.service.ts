import { WorkFlow } from"@entities/workFlow";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class WorkPlansService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/WorkPlans";
    }

    get(x: any) {
        return this.httpService.select(this.api);
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(workFlow: WorkFlow) {
        return this.httpService.create(this.api, workFlow);
    }

    update(id: string, workFlow: WorkFlow) {
        return this.httpService.update(`${this.api}/${id}`, workFlow);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean): Observable<Query<WorkFlow>> {
        return this.httpService.select<Query<WorkFlow>>(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<WorkFlow[]> { 
        return this.httpService.select<WorkFlow[]>(`${this.api}`, params, withRefresh);
    }
}
