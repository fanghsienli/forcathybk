import { Component, OnInit, Input, EventEmitter, HostBinding, Output } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { OptionsService } from "@services/options.service";
import { debounceTime, filter, distinctUntilChanged, tap, switchMap } from "rxjs/operators";
import { Option } from "@entities/entity";
import { AppService } from "@services/app.service";
import { OptionSelect } from "@models/entity";

@Component({
    selector: "optionValue",
    templateUrl: "component.html",
    styleUrls: ["component.css"]
})
export class OptionValueComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() option$: BehaviorSubject<Option>;
    @Input() appendOn$: BehaviorSubject<any>;
    @Input() parent: Option;
    @Input() errors$: BehaviorSubject<string[]>;
    option: Option;
    appendOnCreatedById: string;
    hoverId: string;
    optionValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    optionValueCount$: Observable<number>;
    optionSelects: OptionSelect[];
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class._info") isNewOption: boolean = false;
    @HostBinding("class._warning") isEmpty: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    @HostBinding("class._error") isDuplicated: boolean = false;
    @Input() title: string;
    focused: boolean;
    optionValue: string;
    subscription: Subscription;
    appendOnSubscription: Subscription;
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
        this.isEmpty = false;
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
        this.optionSelects = new Array<OptionSelect>();
    }

    createFile(event) {
        this.change.emit(event);
    }

    checkOptionValue(optionValue: string) {
        this.optionValue$.next(optionValue.trim());
    }

    focus() {
        if (!this.focused) this.focused = true;
    }

    blur() {
        this.focused = false;
        if (this.hoverId && this.optionSelects.length > 0) this.optionValue = this.optionSelects.find(x => x.id === this.hoverId).value;
        if (this.hoverClear === true || this.optionValue === "") {
            this.hoverClear = true;
            this.optionValue = "";
        }
        this.optionValue$.next(this.optionValue.trim());
    }

    keydown(event) {
        if (event.code === "NumpadEnter") {
            this.optionValue$.next(this.optionValue.trim());
        }
    }

    click(optionSelect: OptionSelect) {
        this.optionValue = optionSelect.value;
        this.blur();
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
        if (this.optionCountSubscription) this.optionCountSubscription.unsubscribe();
        if (this.appendOnSubscription) this.appendOnSubscription.unsubscribe();
    }
    resetOption() {
    }
    ngOnInit() {
        this.subscription = this.option$.subscribe(option => {
                this.option = option;
                this.optionValue = this.option.value || "";
                if (this.optionValue$.getValue() !== this.optionValue) this.optionValue$.next(this.optionValue);
                this.isNewOption = Boolean(!option.createdById && option.value);

                if (this.optionValue$.getValue() === "") {
                    let errors = this.appService.errors$.getValue();
                    if (!errors.find(x => x === `${this.parent.value}空白`)) errors.push(`${ this.parent.value }空白`);
                    this.appService.errors$.next(errors);
                }

                if (!this.autocomplete) {
                    if (this.appendOnSubscription) this.appendOnSubscription.unsubscribe();
                    this.appendOnSubscription = this.appendOn$.subscribe(appendOn => {
                        if (appendOn.createdById !== this.appendOnCreatedById) {
                            this.appendOnCreatedById = appendOn.createdById;
                            this.optionValue = "";
                            this.hoverClear = true;
                            this.optionValue$.next("");
                        }
                    });
                } else {       
                    if (this.optionCountSubscription) this.optionCountSubscription.unsubscribe();
                    this.optionCountSubscription = this.optionsService.count({ value: this.optionValue, parentId: this.parent.id, excludeId: this.option$.getValue().id }, false).subscribe(count => {
                        if (count > 0) this.isDuplicated = true;
                        else this.isDuplicated = false;
                    });
                }
        });

        if (this.autocomplete) {
            this.subscription.add(
                this.optionValue$.pipe(
                    tap(valueLike => { if (valueLike.length === 0) this.optionSelects = []; }),
                    filter(valueLike => valueLike.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    tap(() => { if (this.focused === true) this.loading = true; }),
                    switchMap(valueLike => this.optionsService.getSelect({ valueLike: valueLike, parentId: this.parent.id }, false))
                ).subscribe((optionSelects: OptionSelect[]) => {
                    if (this.focused === true) this.optionSelects = optionSelects;
                    this.loading = false;
                })
            );


            this.subscription.add(
                this.optionValue$.pipe(
                    tap(value => {
                        this.optionValue = value;
                        let errors = this.appService.errors$.getValue();
                        if (value==="") {
                            this.hoverClear = false;
                            errors = errors.filter(x => x !== `${this.parent.value}編號空白` && x !== `${this.parent.value}編號重複`);
                            this.isNewOption = false;
                            if (!errors.find(x => x === `${this.parent.value}空白`)) errors.push(`${this.parent.value}空白`);                           
                            this.isEmpty = true;
                        } else {                            
                            errors = errors.filter(x => x !== `${this.parent.value}空白`);
                            this.isEmpty = false;
                        }
                        this.appService.errors$.next(errors);
                    }),
                    filter(value => value.length > 0 && this.focused === false),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(value => this.optionsService.getBy({ value: value, parentId: this.parent.id }, false))
                ).subscribe((existedOption: Option) => {
                    if (existedOption) {
                        this.option$.next(existedOption);
                        let errors = this.appService.errors$.getValue();
                        errors = errors.filter(x => x !== `${this.parent.value}編號空白` && x !== `${ this.parent.value }編號重複`);
                        this.appService.errors$.next(errors);
                    }
                    else {
                        this.isNewOption = true;
                        this.resetOption();
                    }
                    this.optionSelects = [];
                })
            );
        } else {
            this.subscription.add(
                this.optionValue$.pipe(
                    tap(value => {
                        let errors = this.appService.errors$.getValue();
                        let option = this.option$.getValue();
                        option.value = value;
                        if (value.length === 0) {
                            this.hoverClear = false;
                            errors = errors.filter(x => x !== `${this.parent.value}重複`);
                            this.isDuplicated = false;
                            if (!errors.find(x => x === `${this.parent.value}空白`)) errors.push(`${this.parent.value}空白`);
                            this.isEmpty = true;
                        } else {
                            errors = errors.filter(x => x !== `${this.parent.value}空白`);
                            this.isEmpty = false;
                        }
                        this.appService.errors$.next(errors);
                        this.option$.next(option);
                    }),
                    filter(code => code.length > 0),
                    debounceTime(200),
                    distinctUntilChanged(),
                    switchMap(value => this.optionsService.count({ value: value, excludeId: this.option$.getValue().id }, false))
                ).subscribe(count => {
                    let errors = this.appService.errors$.getValue();
                    if (count > 0) {
                        this.isDuplicated = true;
                        if (!errors.find(x => x === `${this.parent.value}重複`)) errors.push(`${this.parent.value}重複`);
                    }
                    else {
                        errors = errors.filter(x => x !== `${this.parent.value}重複`);
                        this.isDuplicated = false;
                    }
                    this.appService.errors$.next(errors);
                })
            );


        }



    }

    hasError(error: string) {
        return this.appService.errors$.getValue().find(x => x === error);
    }



}
