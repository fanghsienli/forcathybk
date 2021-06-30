import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../@services/app.service';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: "root",
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(public appService: AppService) {

    }

    canDeactivate(component: CanComponentDeactivate) { 
       

        return component.canDeactivate ? component.canDeactivate() : true;
    }
}