import { ItemCategory } from"@entities/item";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from"rxjs";
import { Query } from"@models/query";
@Injectable({providedIn: "root"})
export class ItemCategoriesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/ItemCategories";
    }

    get(x: any) {
        return this.httpService.select(this.api);
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(itemCategory: ItemCategory) {
        return this.httpService.create(this.api, itemCategory);
    }

    archive(id: string, itemCategory: ItemCategory) {
        return this.httpService.update(`${this.api}/${id}`, itemCategory);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any, withRefresh: boolean): Observable<ItemCategory[]> {
        return this.httpService.select<ItemCategory[]>(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<ItemCategory[]>> {
        return this.httpService.select<Query<ItemCategory[]>>(`${this.api}`, params, withRefresh);
    }  
}
