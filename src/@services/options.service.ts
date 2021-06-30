import { Option } from"@entities/entity";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from "rxjs";
import { OptionSelect } from "@models/entity";

@Injectable({providedIn: "root"})
export class OptionsService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Options";
    }

    find(id: string): Observable<Option> {
        return this.httpService.select(`${this.api}/${id}`);
    }

    getSelect(params: any, withRefresh: boolean) {
        return this.httpService.select<OptionSelect[]>(`${this.api}/Select`, params, withRefresh);
    }
    getBy(params: any, withRefresh: boolean) {
        return this.httpService.select<Option>(`${this.api}/By`, params, withRefresh);
    }

    select(params: any, withRefresh: boolean): Observable<Option[]> {
        return this.httpService.select<Option[]>(`${this.api}`, params, withRefresh);
    }
    count(params: any, withRefresh: boolean) {
        return this.httpService.select<number>(`${this.api}/Count`, params, withRefresh);
    }
    create(option: Option) {
        return this.httpService.create(this.api, option);
    }

    update(id: string, option: Option) {
        return this.httpService.update(`${this.api}/${id}`, option);
    } 

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
