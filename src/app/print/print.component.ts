import { Component, OnInit } from "@angular/core";
import { InventoriesService } from "@services/inventories.service";
import { AppService } from "@services/app.service"; 
import { InventoryPrint } from "@models/inventory";

@Component({
    selector: "print",
    templateUrl: "print.component.html",
    styleUrls: ["print.component.css"],
    host: { "style": "width:760px" }
})
export class PrintComponent implements OnInit {
    prints: InventoryPrint[];
    id: string;
    type: string;
    url: URL;
    constructor(
        private inventoriesService: InventoriesService,
        public appService: AppService) {
    }

    ngOnInit() {
        this.appService.print = true;
        let urlSegment = window.location.href.split("/");
        let module = urlSegment[3];
        if (module === "print") {
            this.url = new URL(window.location.href);
            this.type = urlSegment[4].split("?")[0];

        }
        switch (this.type) {
            case "inventories":
                this.prints = new Array<InventoryPrint>();
                this.inventoriesService.getPrints({
                    itemId: this.url.searchParams.get("itemId"),
                    recipeId: this.url.searchParams.get("recipeId"),
                    inventoryId: this.url.searchParams.get("inventoryId"),
                    pageIndex: this.url.searchParams.get("pageIndex"),
                    pageSize: this.url.searchParams.get("pageSize")
                }, false).subscribe((prints: InventoryPrint[]) => {
                    this.prints = prints;
                    this.prints.forEach(print => {
                        print.no.indexOf("_");
                        print._code = print.no.substr(0, print.no.indexOf("_"));
                        print.no = print.no.substr(print.no.indexOf("_")+1);
                    });

                    setTimeout(() => { window.print(); }, 1000);
                });
                break;
            default:
                break;
        }
    }
}