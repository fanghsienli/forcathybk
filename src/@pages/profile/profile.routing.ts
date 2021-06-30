import { NgModule } from"@angular/core";
import { RouterModule, Routes } from"@angular/router";
import { ProfileViewComponent } from "./view/profile.view.component"; 
export const profileRoutes: Routes = [
    {
        path:"",
        component: ProfileViewComponent 
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(profileRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProfileRouting { }
