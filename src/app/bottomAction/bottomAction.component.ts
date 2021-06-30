import { Component, OnInit, Input } from "@angular/core";
import { Inventory } from "@entities/inventory";
import { Subscription } from "rxjs";
import { AppService } from "@services/app.service";

@Component({
    selector: "bottomAction",
    templateUrl: "bottomAction.component.html",
    styleUrls: ["bottomAction.component.css"],
    host: { "class": "Ecl-t" }
})
export class BottomActionComponent implements OnInit {
    inventoriesSum: number;
    inventories: Inventory[];
    inventoriesSubscription: Subscription;
    @Input() bottom: any;
    bottomSubscription: Subscription;
    action: any;
    actionSubscription: Subscription;
    inventoriesUnit: string;
    constructor(public appService: AppService) {

    }
    ngOnDestroy() {
        if (this.inventoriesSubscription) this.inventoriesSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
    }
    ngOnInit() {
        

        this.actionSubscription = this.appService.action$.subscribe((action: string) => {
            if (action !== "繼續" && action !== "返回") {
                this.action = action;
                switch (this.action) {

                    default:
                        break;
                }
            }
        });
    }

    nextAction(action: string) {

        this.appService.action$.next(action);
    }
}
