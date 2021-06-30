import { Component, OnInit } from "@angular/core";
import { Layout } from "@models/app.model";
import { Observable } from "rxjs";
import { AppService } from "@services/app.service";
import { Location } from "@angular/common";

@Component({
    selector: "officeFooter",
    templateUrl: "officeFooter.component.html",
    styleUrls: ["officeFooter.component.css"],
    host: {
        "class": "_8Rna9 _3Laht", "role":"contentinfo"}
})
export class OfficeFooterComponent implements OnInit {    
    constructor(
        public appService: AppService,
        private location: Location
    ) { }

    ngOnInit() {
    } 

    next() {
    }

    close() {
        this.location.back();
    }
}
