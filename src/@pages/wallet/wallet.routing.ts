import { NgModule } from"@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WalletComponent } from "./wallet.component";
export const inventoriesRoutes: Routes = [
    {
        path: "",
        component: WalletComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(inventoriesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WalletRouting { }
