import { Component, OnInit, ElementRef, HostListener, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AttributesService } from "@services/attributes.service";
import { AppService } from "@services/app.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { tap, debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { Attribute } from "@entities/attribute";
import * as attributeReducers from "@reducers/attribute";
import { Store, select } from "@ngrx/store";
import { AttributesCheckboxTempleteActions } from "@actions/attribute";
@Component({
    selector: "attributesCheckboxTemplete",
    templateUrl: "attributes.checkbox.templete.html",
    styleUrls: ["attributes.checkbox.templete.css"]
})
export class AttributesCheckBoxTemplete implements OnInit {
    checkedAttributes: Attribute[];
    loading: boolean;
    action: string;
    attributes: Attribute[];
    ngOnInitSubscription: Subscription;
    anyLike$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    anyLike: string;
    itemId: string;
    collapse: boolean;
    attributesSubscription: Subscription;
    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        private attributesService: AttributesService,
        public appService: AppService,
        private store: Store<attributeReducers.State>) {
        this.checkedAttributes = new Array<Attribute>();
        this.collapse = true;
        console.log("no clicks yet");
    }

    public text: string;

    private wasInside = false;
    @HostListener('click')
    clickInside() {
        //console.log("clicked in");
        this.wasInside = true;
    }

    @HostListener('document:click')
    clickout() {
        if (!this.wasInside) {
            //console.log("clicked out");
            this.collapse = true;
        }
        this.wasInside = false;
    }

    change(attribute: Attribute) {
        if (attribute._checked) {
            if (!this.checkedAttributes.find(x => x.id === attribute.id)) this.checkedAttributes.push(attribute);
        } else this.checkedAttributes = this.checkedAttributes.filter(x => x.id !== attribute.id);

        this.store.dispatch(AttributesCheckboxTempleteActions.setSelectedIds({ selectedIds: this.checkedAttributes.map(x => x.id) }));
    }
    filterAttributes(anyLike: string) {
        this.anyLike$.next(anyLike);
    }
    ngOnDestroy() {
        if (this.attributesSubscription) this.attributesSubscription.unsubscribe();
        if (this.ngOnInitSubscription) this.ngOnInitSubscription.unsubscribe();
    }

    getAttributes(): Promise<Attribute[]> {
        if (this.attributesSubscription) this.attributesSubscription.unsubscribe();
        return new Promise((resolve) => {
            this.attributesSubscription = this.store.pipe(
                select(attributeReducers.attributesCheckboxTemplete_attributes(), {}),
                filter(x => x.loaded)).subscribe(result => {
                   
                    this.anyLike = result.anyLike;
                    let o = result.attributes;
                    console.log(o);
                    resolve(o);
                });
        });
    }

    ngOnInit() {
        this.ngOnInitSubscription = this.anyLike$.pipe(
            tap(anyLike => this.anyLike = anyLike),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((anyLike: string) => {
            anyLike = anyLike || "";
            this.store.dispatch(AttributesCheckboxTempleteActions.setFilter({ anyLike: anyLike.trim() }));
            this.reLoad(1);
        });
    }

    async reLoad(debounceTime: number) {
        this.attributes = [];
        this.loadMore(debounceTime);
    }

    async loadMore(debounceTime: number) {
        this.loading = true;
        let moreAttributes = await this.getAttributes();
        console.log(moreAttributes);
        if (moreAttributes.length > 0) {
            console.log(moreAttributes);
            moreAttributes.forEach(attribute => {
                this.attributes.push({ ...attribute });
            });
            for (let i = 0; i < this.attributes.length; i++) {
                if (this.checkedAttributes.find(x => x.id === this.attributes[i].id)) this.attributes[i]._checked = true;
                else this.attributes[i]._checked = false;
            }
            setTimeout(() => this.loading = false, debounceTime);
        } else {
            setTimeout(() => this.loading = false, debounceTime);
        }
    }
}