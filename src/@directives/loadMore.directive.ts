import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appLoadMore]'    
})
export class LoadMoreDirective implements AfterViewInit {
   // @HostBinding('attr.src') srcAttr = null;

  //  @HostBinding('attr.class') class = "hideImg";
  //  @Input() src: string;
    @Output()    onSeeMe = new EventEmitter();
    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    }

    private canLazyLoad() {
        return window && 'IntersectionObserver' in window;
    }

    private lazyLoadImage() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(({ isIntersecting }) => {
                if (isIntersecting) {
                    this.loadImage();
                    obs.unobserve(this.el.nativeElement);
                }
            });
        });
        obs.observe(this.el.nativeElement);
    }

    private loadImage() {
        this.onSeeMe.emit();
      //  this.class = "hideImg show";
       // this.srcAttr = this.src;
    }
}