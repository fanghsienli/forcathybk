import { NgModule } from"@angular/core";
import { AttributePagesRouting } from"./attribute.pages.routing";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from"@angular/forms"; 
import { AttributeViewPage } from "@pages/attribute/view/attribute.view.page"; 
import { ItemTempletesModule } from "@templetes/item/item.templetes.module";
import { StoreModule } from "@ngrx/store";
import * as attribute from "@reducers/attribute";

@NgModule({
    imports: [
        StoreModule.forFeature(attribute.featureKey, attribute.reducers),
        ReactiveFormsModule,
        CoreModule,
        AttributePagesRouting,
        ItemTempletesModule
    ],
    declarations: [
        AttributeViewPage
    ]
})

export class AttributePagesModule { }
