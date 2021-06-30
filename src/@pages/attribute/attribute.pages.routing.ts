import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AttributeViewPage } from "@pages/attribute/view/attribute.view.page";

export const attributesRoutes: Routes = [
    {
        path: ":id",
        component: AttributeViewPage
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(attributesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AttributePagesRouting { }
