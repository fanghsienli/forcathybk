import { Inventory } from "@entities/inventory";
import { Injectable } from "@angular/core";

import { HttpService } from "@services/http.service";
import { Observable } from "rxjs";
import { Item } from "@entities/item";


@Injectable({providedIn: "root"})
export class RecipesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api = "api/Recipes";
    }

    create(recipeOption: {item:Item}) {
        return this.httpService.create(this.api, recipeOption);
    }

    update(id: string, option: Inventory) {
        return this.httpService.update(`${this.api}/${id}`, option);
    }

    delete(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }
}
