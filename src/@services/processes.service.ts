import { Process } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { Query } from"@models/query";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
@Injectable({providedIn: "root"})
export class ProcessesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Processes/";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}${id}`);
    }

    create(process: Process) {
        return this.httpService.create(this.api, process);
    }

    update(id: string, process: Process) {
        return this.httpService.update(`${this.api}${id}`, process);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}${id}`);
    }

    select(params: any) {
        return this.httpService.select(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Process>> {
        return this.httpService.select<Query<Process>>(`${this.api}`, params, withRefresh);
    }
}
