import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
import { ComponentsModule } from "@components/components.module";

import { DirectivesModule } from "@directives/module";
import { RouterModule } from "@angular/router";
@NgModule({
    exports: [
        RouterModule, 
        DirectivesModule,
        PipesModule,
        CommonModule,
        FormsModule,
        ComponentsModule
    ]
})
export class CoreModule { }
