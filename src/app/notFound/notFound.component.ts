import { Component, OnInit } from "@angular/core";
import { AppService } from "@services/app.service";
import { Router } from "@angular/router";

@Component({
    selector: "notFound",
    templateUrl: "notFound.component.html",
    styleUrls: ["notFound.component.css"],
    host: { "class": "SCxLW uzKWK", "role": "main" }
})
export class NotFoundComponent implements OnInit {
    
    constructor(private router: Router,
        public appService: AppService) {
    }

    ngOnDestroy() {
      
    }

    ngOnInit() {
       
    }
}
