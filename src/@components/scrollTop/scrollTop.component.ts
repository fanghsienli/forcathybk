import { Component, OnInit, Inject, HostListener } from "@angular/core";
import { DOCUMENT } from "@angular/common";
 
@Component({
    selector: "scrollTop",
    templateUrl: "./scrollTop.component.html",
    styleUrls: ["./scrollTop.component.css"]
})
export class ScrollTopComponent implements OnInit {
    windowScrolled: boolean;
    displayNone: boolean;
    constructor(@Inject(DOCUMENT) private document: Document) { }
    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
     
            this.displayNone = false;
            setTimeout(() => { this.windowScrolled = true; }, 200);
        }
        else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
            setTimeout(() => { this.displayNone = true; }, 200);
            
        }
    }
    scrollToTop() {
        (function smoothscroll() {
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }
    ngOnInit() { }
}