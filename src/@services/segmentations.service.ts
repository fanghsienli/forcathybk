import { Segmentation } from"@entities/inventory";
import { Injectable } from"@angular/core";
import { Query } from"@models/query";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";

@Injectable({providedIn: "root"})
export class SegmentationsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Segmentations/";
    }
    count(params: any, withRefresh: boolean) {
        return this.httpService.select<number>(`${this.api}/Count`, params, withRefresh);
    }
    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(segmentation: Segmentation) {
        return this.httpService.create(this.api, segmentation);
    }

    update(id: string, segmentation: Segmentation) {
        return this.httpService.update(`${this.api}/${id}`, segmentation);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any) {
        return this.httpService.select(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Segmentation>> {
        return this.httpService.select<Query<Segmentation>>(`${this.api}`, params, withRefresh);
    }
}
