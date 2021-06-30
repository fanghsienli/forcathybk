import { NgModule } from"@angular/core";
import { WalletRouting } from"./wallet.routing";
import { CoreModule } from"app/core/core.module";
import { ReactiveFormsModule } from"@angular/forms"; 
import { WalletComponent } from "@pages/wallet/wallet.component"; 
import { InventoryComponentsModule } from "@components/inventory/module";


@NgModule({
    imports: [
        ReactiveFormsModule,
        CoreModule,
        WalletRouting,
        InventoryComponentsModule
    ],
    declarations: [
        WalletComponent
    ]
})

export class WalletModule { }
