import { Item } from "@entities/item"; 
import { Injectable, InjectionToken, Inject } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable, of, throwError } from"rxjs";
import { ItemSave, ItemSelect, ItemDetail, ItemUpload } from "@models/item";
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
export class ItemsService {
    private collectionKey = "inventories-app";
    getCollection() {
        return this.supported().pipe(
            map(_ => this.storage.getItem(this.collectionKey)),
            map((value: string | null) => (value ? JSON.parse(value) : []))
        );
    }

    private api: string;
    constructor(@Inject(LOCAL_STORAGE_TOKEN) private storage: Storage,
    private httpService: HttpService) {
        this.api ="api/Items";
    }

    supported(): Observable<boolean> {
        return this.storage !== null
            ? of(true)
            : throwError("Local Storage Not Supported");
    } 

    getSelect(params: any) {
        return this.httpService.select<ItemSelect[]>(`${this.api}/Select`, params, false);
    }

    getBy(params: any, withRefresh: boolean) { 
        return this.httpService.select<Item>(`${this.api}/By`, params, withRefresh);
    }

    toggleStatus(id: string) {
        return this.httpService.update(`${this.api}/Status/${id}`, null);
    }

    upload(itemUpload: ItemUpload) {
        return this.httpService.create(`${this.api}/Upload`, itemUpload);
    }

    select(params: any) {
        return this.httpService.select<Item[]>(`${this.api}`, params, false);
    }

    findDetail(id: string) {
        return this.httpService.select<ItemDetail>(`${this.api}/Detail/${id}`);
    }

    selectList(params: any) {
        return this.httpService.select<any>(`${this.api}/List`, params,false);
    }

    find(id: string) {
        return this.httpService.select<Item>(`${this.api}/${id}`);
    }

    create(item: any) {
        return this.httpService.create(this.api, item);
    }

    save(id: string, itemSave: ItemSave) {
        return this.httpService.update(`${this.api}/Save/${id}`, itemSave);
    }

    update(id: string, item: any) {
        return this.httpService.update(`${this.api}/${id}`, item);
    }

    remove(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    count(params: any) {
        return this.httpService.select<number>(`${this.api}/Count`, params, false);
    }

    isDuplicate(params: any) {
        return this.httpService.select<boolean>(`${this.api}/IsDuplicate`, params, false);
    }
}
