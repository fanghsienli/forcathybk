import { CategoryAttribute } from "@entities/category"; 
import { Injectable, InjectionToken, Inject } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable, of, throwError } from"rxjs";
import { Query } from"@models/query";
import { map } from "rxjs/operators";

export function storageFactory() {
    return typeof window === undefined || typeof localStorage === undefined
        ? null
        : localStorage;
}

export const LOCAL_STORAGE_TOKEN = new InjectionToken(
    "example-app-local-storage",
    { factory: storageFactory }
);

@Injectable({providedIn: "root"})
export class CategoryAttributesService {
    private collectionKey = "inventories-app";
    getCollection() {
        return this.supported().pipe(
            map(_ => this.storage.getCategoryAttribute(this.collectionKey)),
            map((value: string | null) => (value ? JSON.parse(value) : []))
        );
    }
    private api: string;
    constructor(@Inject(LOCAL_STORAGE_TOKEN) private storage: Storage,
    private httpService: HttpService) {
        this.api ="api/CategoryAttributes";
    }
    supported(): Observable<boolean> {
        return this.storage !== null
            ? of(true)
            : throwError("Local Storage Not Supported");
    } 

    getBy(params: any, withRefresh: boolean) { 
        return this.httpService.select<CategoryAttribute>(`${this.api}/By`, params, withRefresh);
    }
    toggleStatus(id: string) {
        return this.httpService.update(`${this.api}/Status/${id}`, null);
    }


    get(params: any, withRefresh: boolean) {
        return this.httpService.select<CategoryAttribute[]>(`${this.api}`, params, withRefresh);
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(categoryAttribute: any) {
        return this.httpService.create(this.api, categoryAttribute);
    }

    update(id: string, categoryAttribute: any) {
        return this.httpService.update(`${this.api}/${id}`, categoryAttribute);
    }

    remove(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    count(params: any, withRefresh: boolean) {
        return this.httpService.select<number>(`${this.api}/Count`, params, withRefresh);
    }

    select(params: any, withRefresh: boolean) {
        return this.httpService.select<CategoryAttribute[]>(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<CategoryAttribute>> {
        return this.httpService.select<Query<CategoryAttribute>>(`${this.api}`, params, withRefresh);
    }
}
