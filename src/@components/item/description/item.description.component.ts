import { Component, OnInit, Input, EventEmitter, Output, HostBinding } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { CategoriesService } from "@services/categories.service";
import { Item } from "@entities/item";
import { Category } from "@entities/category";
import { debounceTime, tap, switchMap, filter } from "rxjs/operators";
import { AppService } from "@services/app.service";
import { CategorySelect } from "@models/category";

@Component({
    selector: "itemDescription",
    templateUrl: "item.description.component.html",
    styleUrls: ["item.description.component.css"],
    host: { "style": "align-items:stretch;box-sizing:border-box;position:relative;height:81px" }
})
export class ItemDescriptionComponent implements OnInit {
    @Input() autocomplete: boolean;
    @Input() item$: BehaviorSubject<Item>;
    @Input() title: string;
    item: Item;
    hoverId: string;
    categoryLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    descriptionFocused: boolean;
    itemDescription: string;
    filteredCategories$: Observable<Category[]>;
    categorySelects: CategorySelect[];
    categoryValues: string[];
    open: boolean;
    focused: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter();
    categoryLikeSubscription: Subscription;
    @HostBinding("class.IpSxo") IpSxo: boolean = false;
    @HostBinding("class.Bbciv") Bbciv: boolean = false;
    @HostBinding("class._info") isNewItem: boolean = false;

    loading: boolean;
    subscription: Subscription;
    hoverClear: boolean;
    start: number = 0;
    end: number = 0;
    categorySelectValue: string;

    constructor(
        public categoriesService: CategoriesService,
        public appService: AppService
    ) {
        this.categorySelectValue = "";
        this.categorySelects = [];
        if (this.appService.mobile) {
            this.Bbciv = false;
            this.IpSxo = true;
        }
        else {
            this.Bbciv = true;
            this.IpSxo = false;
        }
    }

    searchCategories(event) {
        let description = event.target.value;
        if (description.search("#") !== -1) {
            let categoryLike = "";
            if (description.substring(0, event.target.selectionStart).lastIndexOf("#") > description.substring(0, event.target.selectionStart).lastIndexOf(" ")) {
                this.start = description.substring(0, event.target.selectionStart).lastIndexOf("#");
                this.end = Math.min(
                    description.substring(event.target.selectionStart).indexOf("#") === -1 ? description.length : description.substring(event.target.selectionStart).indexOf("#"),
                    description.substring(event.target.selectionStart).indexOf(" ") === -1 ? description.length : description.substring(event.target.selectionStart).indexOf(" ")
                ) + event.target.selectionStart;
                categoryLike = description.substring(description.substring(0, event.target.selectionStart).lastIndexOf("#")).split(" ")[0];
                categoryLike = categoryLike.split("#")[1];
            }
            if (categoryLike.length > 0) {
                this.categoryLike$.next(categoryLike);
            } else {
                this.categorySelects = [];
            }
        }
    }

    createFile(event) {
        this.change.emit(event);
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.subscription = this.item$.subscribe(item => {
            this.item = item;
            this.itemDescription = this.item.description || "";
            this.isNewItem = Boolean(!item.createdById && item.value);
        });

        this.categoryValues = new Array<string>();
        this.subscription.add(
            this.categoryLike$.pipe(
                filter(categoryLike => categoryLike.length > 0),
                debounceTime(200), 
                tap(() => { if (this.focused === true) this.loading = true; }),
                switchMap(anyLike => this.categoriesService.getSelect({ anyLike: encodeURIComponent(anyLike) }, false))
            ).subscribe((categorySelects: CategorySelect[]) => {
                this.categorySelects = categorySelects;
                this.loading = false;
            })
        );
    }

    focus() {
        this.focused = true;
    }
    blur2() {
        if (!this.autocomplete) this.blur();
    }
    blur() {
        
        this.focused = false;
        if (this.hoverClear) this.itemDescription = "";
        if (this.hoverId && this.categorySelects.length > 0) {
            this.categorySelectValue = this.categorySelects.find(x => x.id === this.hoverId).value;
        }
        if (this.categorySelectValue && this.categorySelectValue.length > 0) {
            this.itemDescription = `${this.itemDescription.substring(0, this.start)}#${this.categorySelectValue}${this.itemDescription.substring(this.end)}`;
            this.categorySelectValue = "";
        }
        this.item = this.item$.getValue();
        this.item.description = this.itemDescription;
        this.item$.next(this.item);
        this.categorySelects = [];
    }

    click(categorySelect: CategorySelect) {
        this.categorySelectValue = categorySelect.value;
        this.blur();
    }

    isNew() {
        let item = this.item$.getValue();
        this.isNewItem = Boolean(!item.createdById && item.value);
        return this.isNewItem;
    }
}
