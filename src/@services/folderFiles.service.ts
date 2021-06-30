import { FolderFile } from "@entities/entity";
import { Query } from "@models/query";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
import { Observable } from "rxjs";
@Injectable({providedIn: "root"})
export class FolderFilesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/FolderFiles/";
    }

    get(x: any) {
        return this.httpService.select(this.api);
    }

    find(id: string) {
        return this.httpService.select(`${this.api}/${id}`);
    }

    create(folderFile: FolderFile) {
        return this.httpService.create(this.api, folderFile);
    }

    update(id: string, folderFile: FolderFile) {
        return this.httpService.update(`${this.api}/${id}`, folderFile);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    count(params: any, withRefresh: boolean) {
        return this.httpService.select<number>(`${this.api}/Count`, params, withRefresh);
    }
    select(params: any, withRefresh: boolean) {
        return this.httpService.select<FolderFile[]>(`${this.api}`, params, withRefresh);
    }

    search(params: any, withRefresh: boolean): Observable<Query<FolderFile>> {
        return this.httpService.select<Query<FolderFile>>(`${this.api}`, params, withRefresh);
    }
}
