import { NgModule } from"@angular/core";
import { ProfileViewComponent } from"./view/profile.view.component"; 
import { CoreModule } from"app/core/core.module"; 
import { ProfileRouting } from "./profile.routing";  
import { ItemTempletesModule } from "@templetes/item/item.templetes.module";
import * as profile from "@reducers/profile";
import { ProfileViewPageEffects } from "@effects/profile";
import { EffectsModule } from "@ngrx/effects"; 
import { StoreModule } from "@ngrx/store";

@NgModule({
    imports: [
        CoreModule,
        StoreModule.forFeature(profile.featureKey, profile.reducers),
        EffectsModule.forFeature([ProfileViewPageEffects]),
        ProfileRouting,
        ItemTempletesModule
    ],
    declarations: [
        ProfileViewComponent 
    ]
})

export class ProfileModule { }
