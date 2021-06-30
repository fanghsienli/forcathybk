import { NgModule } from"@angular/core";
import { LikePipe } from"./like.pipe";
import { NotInPipe } from"./notIn.pipe";
import { HighLightPipe } from"./highLight.pipe";
import { EqualPipe } from"./equal.pipe";
import { OrderByPipe } from"./orderBy.pipe";
import { AgoPipe } from"./ago.pipe";
@NgModule({
    declarations: [
        NotInPipe,
        EqualPipe,
        OrderByPipe,
        AgoPipe,
        HighLightPipe,
        LikePipe
    ],
    exports: [
        NotInPipe,
        EqualPipe,
        OrderByPipe,
        AgoPipe,
        HighLightPipe,
        LikePipe
    ]
})

export class PipesModule { }