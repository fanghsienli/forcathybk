import { Inventory } from "@entities/inventory";
import { Injectable } from "@angular/core";
import { Query } from "@models/query";
import { HttpService } from "@services/http.service";
import { Observable } from "rxjs";
import { InventorySave, InventoryPutdown, InventorySelect, InventoryAttributeList, InventoryList, InventoryPrint, InventoryPosition, InventoryMerge } from "@models/inventory";
import { PostPosition } from "@models/entity";
import { Grid } from "@models/app.model";

@Injectable({providedIn: "root"})
export class InventoriesService {
    private api: string;
    constructor(private httpService: HttpService) {
        this.api = "api/Inventories";
    }

    getCount(inventoryId: string) { 
        return this.httpService.select<number>(`${this.api}/Count/${inventoryId}`);
    }

    getSelect(params: any, withRefresh: boolean) {
        return this.httpService.select<InventorySelect[]>(`${this.api}/Select`, params, withRefresh);
    }
    selectList(params: any) { 
        return this.httpService.select<any>(`${this.api}/List`, params, false);
    }
    selectRelationshipTarget(params: any) {
        return this.httpService.select<any>(`${this.api}/RelationshipTarget`, params, false);
    }
    getBy(params: any, withRefresh: boolean) {
        return this.httpService.select<Inventory>(`${this.api}/By`, params, withRefresh);
    }

    pickup(postPosition: PostPosition) {
        return this.httpService.create(`${this.api}/Pickup`, postPosition);
    }

    getPutdowns(params: any) { 
        return this.httpService.select(`${this.api}/Putdown`, params, false);
    }

    getPositions(params: any, withRefresh: boolean) {  
        return this.httpService.select<InventoryPosition[]>(`${this.api}/Position`, params, withRefresh);
    }

    getGrids(params: any, withRefresh: boolean) {
        params.type = "inventories";
        return this.httpService.select<Grid[]>(`api/Grids`, params, withRefresh);
    }

    getPrints(params: any, withRefresh: boolean) { 
        return this.httpService.select<InventoryPrint[]>(`${this.api}/Print`, params, withRefresh);
    }

   

    getLists(params: any) {
        return this.httpService.select<Inventory[]>(`${this.api}/List`, params,false);
    }
 
    getAttributeLists(params: any, withRefresh: boolean) {
        return this.httpService.select<InventoryAttributeList[]>(`${this.api}/AttributeList`, params, withRefresh);
    }

    find(id: string) {
        return this.httpService.select<Inventory>(`${this.api}/${id}`,false);
    }
    findDetails(id: string) {
        return this.httpService.select(`${this.api}/Details/${id}`, false);
    }
    findPage(id: string) {
        return this.httpService.select(`${this.api}/Page/${id}`, false);
    }

    create(inventory: Inventory) {
        return this.httpService.create(this.api, inventory);
    }

    createSave(inventorySave: InventorySave) {
        return this.httpService.create(`${this.api}/Save`, inventorySave);
    }

     createMerge(inventoryMerge: InventoryMerge) {
        return this.httpService.create(`${this.api}/Merge`, inventoryMerge);
    }

    count(params: any, withRefresh: boolean) {
        return this.httpService.select<number>(`${this.api}/Count`, params, withRefresh);
    }

    update(id: string, inventory: Inventory) {
        return this.httpService.update(`${this.api}/${id}`, inventory);
    }

    createWithAttributes(inventoryWithAttributes: any) {
        return this.httpService.create(`${this.api}/WithAttributes`, inventoryWithAttributes);
    }

    createWorkOrder(workOrderWithAttributes: any) {
        return this.httpService.create(`api/WorkOrders`, workOrderWithAttributes);
    }

    createPickup(inventoryPickup: any) {
        return this.httpService.create(`${this.api}/Pickup`, inventoryPickup);
    }
    createStartup(inventoryStartup: any) {
        return this.httpService.create(`${this.api}/Startup`, inventoryStartup);
    }
    createInspection(inventoryInspection: any) {
        return this.httpService.create(`${this.api}/Inspection`, inventoryInspection);
    }
    createStation(inventoryStation: any) {
        return this.httpService.create(`${this.api}/Station`, inventoryStation);
    }
    updateWithAttributes(id: string, inventoryWithAttributes: any) {
        return this.httpService.update(`${this.api}/WithAttributes/${id}`, inventoryWithAttributes);
    }

    remove(id: string) {
        return this.httpService.delete(`${this.api}/${id}`);
    }

    select(params: any) {
        return this.httpService.select<Inventory[]>(`${this.api}`, params, false);
    }

    search(params: any, withRefresh: boolean): Observable<Query<Inventory>> {
        return this.httpService.select<Query<Inventory>>(`${this.api}`, params, withRefresh);
    }
}
