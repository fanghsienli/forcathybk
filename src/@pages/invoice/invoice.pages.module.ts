import { NgModule } from"@angular/core";
import { InvoiceRouting } from"./invoice.pages.routing"; 
import { CoreModule } from "app/core/core.module";
import { InvoicesViewPage } from "../invoices/view/invoices.view.page";

@NgModule({
    imports: [
        CoreModule,
        InvoiceRouting
    ],
    declarations: [
        InvoicesViewPage 
    ]
})

export class InvoicePagesModule { }