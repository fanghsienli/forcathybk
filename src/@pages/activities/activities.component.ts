import { Component, OnInit, ViewChild, ElementRef, Input } from"@angular/core";
import { ActivitiesService } from"@services/activities.service"; 
import { Activity, Process } from"@entities/workflow"; 
@Component({
    selector:"activities",
    templateUrl:"activities.component.html",
    styleUrls: ["activities.component.css"],
    providers: [
        ActivitiesService
    ]
})
export class ActivitiesComponent implements OnInit {
   
    constructor(
        
    ) {

    }
    ngOnInit() { 
 
    }
}