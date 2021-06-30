import { NgModule } from"@angular/core";
import { LazyLoadDirective } from "./lazyLoad.directive";
import { LoadMoreDirective } from "./loadMore.directive";
import { StopPropagationDirective } from "./stopPropagation.directive";
@NgModule({
    declarations: [
        LoadMoreDirective,
        LazyLoadDirective,
        StopPropagationDirective
    ],
    exports: [
        LoadMoreDirective,
        LazyLoadDirective,
        StopPropagationDirective
    ]
})

export class DirectivesModule { }