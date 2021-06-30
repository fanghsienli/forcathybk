import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { Observable, of, BehaviorSubject, Subscription } from "rxjs";
import { OptionsService } from "@services/options.service";
import { Option } from "@entities/entity";
import { debounceTime, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { AppService } from"@services/app.service";
@Component({
    selector: "units",
    templateUrl: "units.component.html",
    styleUrls: ["units.component.css"]
})
export class UnitsComponent implements OnInit {
    @Input() change: any;
    hoverId: string;
    unitLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    titleFocused: boolean;
    filteredUnits$: Observable<Option[]>;
    querying: boolean;
    open: boolean;
    unit: Option;
    units: Option[];
    action: string;
    actionSubscription: Subscription;
    unitsSubscription: Subscription;

    @ViewChild("unitValue") unitValue: ElementRef;
    constructor(
        public optionsService: OptionsService,
        public appService: AppService
    ) { }

    searchUnits(unitLike: string) {
        this.open = true;
        this.unitLike$.next(unitLike);
    }

    close() {
        this.unitValue.nativeElement.value = "";
        this.open = false;
        this.units = [];
    }

    focus() {
        this.titleFocused = true;
    }

    click(unit) {
        this.unit = unit;
        this.appService.action$.next("預覽");
    }

    removeUnit() {
        this.unit = null;
    }

    ngOnDestroy() {
        if (this.unitsSubscription) this.unitsSubscription.unsubscribe();
        if (this.actionSubscription) this.actionSubscription.unsubscribe();
    }

    ngOnInit() {
        this.actionSubscription = this.appService.action$.subscribe((action: string) => { 
            if (action === "預覽" || action === "選取單位") {
                this.action = action;
            } 
        });

        this.unitsSubscription = this.unitLike$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => {
                this.querying = true;
                this.units = [];
            }),
            switchMap((unitLike: string) => this.optionsService.select({ anyLike: unitLike, parentId: "CA05D1E3-E758-47BD-8BE5-25F87E5507C3" }, false))
        ).subscribe((units: Option[]) => {
            this.units = units;
            this.querying = false;
        });
    }

    toggle() {

        this.open = this.open ? false : true;
        if (this.units === [] || this.open) this.searchUnits("");
    }

    blur() {
        this.titleFocused = false;
        this.open = false
        this.unitValue.nativeElement.value = this.units.find(x => x.id === this.hoverId).value;
    }


}
