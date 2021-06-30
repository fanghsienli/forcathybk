import { Category } from"@entities/category";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable, of, throwError } from"rxjs";
import { Query } from "@models/query";
import { CategorySelect } from "@models/category";

@Injectable({providedIn: "root"})
export class CategoriesService {
   
    private api: string;
    constructor(
        private httpService: HttpService) { 
        this.api ="api/Categories";
    }
    retrieve(id: string): Observable<Category> {
        return this.httpService.select<Category>(`${this.api}/${id}`);
    }

    find(id: string): Observable<Category> {
        return this.httpService.select(`${this.api}/${id}`);
    }
    findByValue(value: string): Observable<Category> {
        return this.httpService.select(`${this.api}/ByValue/${value}`);
    }
    select(params: any, withRefresh: boolean) {
        return this.httpService.select<Category[]>(`${this.api}`, params, withRefresh);
    }

    getSelect(params: any, withRefresh: boolean) {
        return this.httpService.select<CategorySelect[]>(`${this.api}/Select`, params, withRefresh);
    }

    getGrid(id: string) {
        return this.httpService.select(`${this.api}/Grid/${id}`);
    }
    getGrids(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}/Grid`, params, withRefresh);
    }
    search(params: any, withRefresh: boolean): Observable<Query<Category>> {
        return this.httpService.select<Query<Category>>(`${this.api}`, params, withRefresh);
    }

    create(category: Category) {
        return this.httpService.create(this.api, category);
    }

    update(id: string, category: Category) {
        return this.httpService.update(`${this.api}/${id}`, category);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
