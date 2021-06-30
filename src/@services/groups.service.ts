import { Group } from"@entities/group";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class GroupsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Groups/";
    }

    filter(params: any, withRefresh: boolean): Observable<Query<Group>> {
        return this.httpService.select<Query<Group>>(`${this.api}`, params, withRefresh);
    }

    select(params: any, withRefresh: boolean): Observable<Group[]> {
        return this.httpService.select<Group[]>(`${this.api}`, params, withRefresh);
    }

   

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(group: Group) {
        return this.httpService.create(this.api, group);
    }

    update(id: string, group: Group) {
        return this.httpService.update(`${this.api}/${id}`, group);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
