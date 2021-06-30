import { Participate } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { Query } from"@models/query";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
@Injectable({providedIn: "root"})
export class ParticipatesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Participates";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(participate: Participate) {
        return this.httpService.create(this.api, participate);
    }

    update(id: string, participate: Participate) {
        return this.httpService.update(`${this.api}/${id}`, participate);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any) {
        return this.httpService.select(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Participate>> {
        return this.httpService.select<Query<Participate>>(`${this.api}`, params, withRefresh);
    }
}
