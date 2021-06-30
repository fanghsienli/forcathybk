import { Activity } from"@entities/workflow";
import { Injectable } from"@angular/core";
import { Query } from"@models/query";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
@Injectable({providedIn: "root"})
export class ActivitiesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Activities/";
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(activity: Activity) {
        return this.httpService.create(this.api, activity);
    }

    update(id: string, activity: Activity) {
        return this.httpService.update(`${this.api}/${id}`, activity);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Activity>> {
        return this.httpService.select<Query<Activity>>(`${this.api}`, params, withRefresh);
    }
}
