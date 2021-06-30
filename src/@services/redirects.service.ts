import { Redirect } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class RedirectsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Redirects";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(redirect: Redirect) {
        return this.httpService.create(this.api, redirect);
    }

    update(id: string, redirect: Redirect) {
        return this.httpService.update(`${this.api}/${id}`, redirect);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Redirect>> {
        return this.httpService.select<Query<Redirect>>(`${this.api}`, params, withRefresh);
    }
}
