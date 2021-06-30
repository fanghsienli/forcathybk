import { Position } from"@entities/inventory";
import { Injectable } from"@angular/core";
import { Query } from"@models/query";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";

@Injectable({providedIn: "root"})
export class PositionsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Positions/";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}${id}`);
    }

    create(position: Position) {
        return this.httpService.create(this.api, position);
    } 

    update(id: string, position: Position) {
        return this.httpService.update(`${this.api}/${id}`, position);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any) {
        return this.httpService.select(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Position>> {
        return this.httpService.select<Query<Position>>(`${this.api}`, params, withRefresh);
    }
}
