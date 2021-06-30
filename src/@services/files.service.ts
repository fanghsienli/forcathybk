import { File } from"@entities/entity";
import { Injectable } from"@angular/core";
import { HttpService } from"@services/http.service";
@Injectable({providedIn: "root"})
export class FilesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api ="api/Files/";
    }
    get() {
        return this.httpService.select(this.api);
    }

    create(images, folder: string) {
        return this.httpService.upload(this.api +"Upload", images, folder)
    }

    getById(id: number) {
        return this.httpService.select(`${this.api}/${id}`);
    } 

    update(file: File) {
        return this.httpService.update(this.api + file.id, file);
    }

    delete(id: number) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
