import { Attribute } from "@entities/attribute";
import { Injectable, Inject } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable, of, throwError } from"rxjs";
import { Query } from "@models/query";
import { map, tap } from "rxjs/operators"; 
import { LOCAL_STORAGE_TOKEN } from "./app.service";
import { AttributeWithItem, AttributeWithCategories } from "@models/attribute";

@Injectable({providedIn: "root"})
export class AttributesService {
   
    private collectionKey = "attributes";
    private api: string;
    constructor(
        @Inject(LOCAL_STORAGE_TOKEN) private storage: Storage,
        private httpService: HttpService) { 
        this.api ="api/Attributes";
    }
    supported(): Observable<boolean> {
        return this.storage !== null
            ? of(true)
            : throwError("Local Storage Not Supported");
    }
    getCollection(): Observable<Attribute[]> {
        return this.supported().pipe(
            map(_ => this.storage.getItem(this.collectionKey)),
            map((value: string | null) => (value ? JSON.parse(value) : []))
        );
    }

    addToCollection(records: Attribute[]): Observable<Attribute[]> {
        return this.getCollection().pipe(
            map((value: Attribute[]) => [...value, ...records]),
            tap((value: Attribute[]) =>
                this.storage.setItem(this.collectionKey, JSON.stringify(value))
            )
        );
    }

    removeFromCollection(ids: Array<string>): Observable<Attribute[]> {
        return this.getCollection().pipe(
            map((value: Attribute[]) => value.filter(item => !ids.includes(item.id))),
            tap((value: Attribute[]) =>
                this.storage.setItem(this.collectionKey, JSON.stringify(value))
            )
        );
    }

    deleteCollection(): Observable<boolean> {
        return this.supported().pipe(
            tap(() => this.storage.removeItem(this.collectionKey))
        );
    }
     






    retrieve(id: string): Observable<Attribute> {
        return this.httpService.select<Attribute>(`${this.api}/${id}`);
    }

    find(id: string): Observable<Attribute> {
        return this.httpService.select(`${this.api}/${id}`);
    }
    findByValue(value: string): Observable<Attribute> {
        return this.httpService.select(`${this.api}/ByValue/${value}`);
    }
    select(params: any) {
        return this.httpService.select<Attribute[]>(`${this.api}`, params, false);
    } 
    selectCheckbox(params: any) {
        return this.httpService.select<Attribute[]>(`${this.api}/Checkbox`, params, false);
    } 

    getGrid(id: string) {
        return this.httpService.select(`${this.api}/Grid/${id}`);
    }
    getGrids(params: any, withRefresh: boolean) {
        return this.httpService.select(`${this.api}/Grid`, params, withRefresh);
    }
    search(params: any, withRefresh: boolean): Observable<Query<Attribute>> {
        return this.httpService.select<Query<Attribute>>(`${this.api}`, params, withRefresh);
    }

    create(attribute: Attribute) {
        return this.httpService.create(this.api, attribute);
    }


    
    selectByInventory(inventoryId: string) {
        return this.httpService.select(`${this.api}/ByInventory/${inventoryId}`);
    }
    selectByItem(itemId: string) {
        return this.httpService.select(`${this.api}/ByItem/${itemId}`);
    }
    createWithItem(attributeWithItem: AttributeWithItem) {
        return this.httpService.create(`${this.api}/WithItem`, attributeWithItem);
    }
    updateWithItem(id: string, attributeWithItem: AttributeWithItem) {
        return this.httpService.update(`${this.api}/WithItem/${id}`, attributeWithItem);
    }
    createWithCategories(attributeWithCategories: AttributeWithCategories) {
        return this.httpService.create(`${this.api}/WithCategories`, attributeWithCategories);
    }
    update(id: string, attribute: Attribute) {
        return this.httpService.update(`${this.api}/${id}`, attribute);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
