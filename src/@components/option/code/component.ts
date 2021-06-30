import { Component, OnInit, Input, EventEmitter, HostBinding, Output } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { OptionsService } from "@services/options.service";
import { debounceTime, filter, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { Option } from "@entities/entity";
import { AppService } from "@services/app.service";

import { OptionSelect } from "@models/entity";
@Component({
    selector: "optionCode",
    templateUrl: "component.html",
    styleUrls: ["component.css"]
})
export class OptionCodeComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() option$: BehaviorSubject<Option>;
    @Input() appendOn$: BehaviorSubject<any>;
    @Input() errors$: BehaviorSubject<string[]>;
    @Input() parent: Option;
    option: Option;
    hoverId: string;
    optionCode$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    optionCodeCount$: Observable<number>;
    optionSelects: OptionSelect[];
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class._info") isNewOption: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    @HostBinding("class._error") isDuplicated: boolean = false;
    @Input() title: string;
    appendOnCreatedById: string;
    subscription: Subscription;
    focused: boolean;
    optionCode: string;
    optionCountSubscription: Subscription;
    loading: boolean;
    hoverClear: boolean;
    constructor(
        public appService: AppService,
        public optionsService: OptionsService
    ) {
        this.loading = false;
        this.focused = false;
        this.hoverClear = false;
        this.isEmpty = true;
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
    }

    createFile(event) {
        this.change.emit(event);
    }

    checkOptionCode(optionCode: string) {
        this.optionCode$.next(optionCode.trim());
    }

    focus() {
        if (!this.focused) this.focused = true;
    }
    blur2() {
        if (!this.autocomplete) this.blur();
    }
    blur() {
        this.focused = false;
        if (this.hoverId && this.optionSelects.length > 0) this.optionCode = this.optionSelects.find(x => x.id === this.hoverId).value;
        if (this.hoverClear === true) this.optionCode = "";
        this.optionCode$.next(this.optionCode.trim());
        this.option = this.option$.getValue();
        this.option.code = this.optionCode;

        this.option$.next(this.option);
    }

    click(optionSelect: OptionSelect) {
        this.optionCode = optionSelect.value;
        this.blur();
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
        if (this.optionCountSubscription) this.optionCountSubscription.unsubscribe();
    }
    resetOption() {
        let option = this.option$.getValue();
        option.code = this.optionCode;
        this.option$.next(option);
    }
    ngOnInit() {
        this.subscription = this.option$.subscribe((option: Option) => {
            this.option = option;
            this.optionCode = this.option.code || "";
            this.isNewOption = Boolean(!option.createdById && option.value);
            if (this.optionCode !== this.optionCode$.getValue()) this.optionCode$.next(this.optionCode);
            if (this.optionCode$.getValue() === "") {
                let errors = this.appService.errors$.getValue();
                if (!errors.find(x => x === `${this.parent.value}編碼空白`)) errors.push(`${this.parent.value}編碼空白`);
                this.appService.errors$.next(errors);
            }
            if (!this.autocomplete) {
                if (this.optionCountSubscription) this.optionCountSubscription.unsubscribe();
                this.optionCountSubscription = this.optionsService.count({ code: this.optionCode, parentId: this.parent.id, excludeId: this.option$.getValue().id }, false).subscribe(count => {
                    if (count > 0) this.isDuplicated = true;
                    else this.isDuplicated = false;
                });
            }
        });

        if (this.autocomplete) {
        } else {
            this.subscription.add(
                this.optionCode$.pipe(
                    tap((code: string) => {
                        this.optionCode = code;
                        this.resetOption();

                        let errors = this.appService.errors$.getValue();
                        if (code.length === 0) {
                            if (this.hoverClear) this.hoverClear = false;
                            errors = errors.filter(x => x !== `${this.parent.value}編碼重複`);
                            this.isDuplicated = false;
                            if (!errors.find(x => x === `${this.parent.value}編碼空白`)) errors.push(`${this.parent.value}編碼空白`);
                            this.isEmpty = true; 
                        } else {                            
                            errors = errors.filter(x => x !== `${this.parent.value}編碼空白`);
                            this.isEmpty = false;
                        }
                        this.appService.errors$.next(errors);
                    }),
                    filter((code: string) => code.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap((code: string) => this.optionsService.count({ code: code, parentId: this.parent.id, excludeId: this.option$.getValue().id }, false))
                ).subscribe((count: number) => {
                    let errors = this.appService.errors$.getValue();
                    if (count > 0) {                        
                        if (!errors.find(x => x === `${this.parent.value}編碼重複`)) errors.push(`${this.parent.value}編碼重複`);
                        this.isDuplicated = true;
                    }
                    else {
                        errors = errors.filter(x => x !== `${this.parent.value}編碼重複`);
                        this.isDuplicated = false;
                    }
                    this.appService.errors$.next(errors);
                })
            );
        }

        this.subscription.add(
            this.appendOn$.subscribe(appendOn => {
                if (appendOn.createdById !== this.appendOnCreatedById) {
                    this.appendOnCreatedById = appendOn.createdById;
                    this.optionCode = "";
                    this.hoverClear = true;
                    this.optionCode$.next("");
                }
            })
        );
    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }

    isNew() {
        let option = this.option$.getValue();
        this.isNewOption = Boolean(!option.createdById && option.value);
        return this.isNewOption;
    }
}
