import { NgModule } from"@angular/core";
import { RouterModule, Routes } from"@angular/router";
import { InvoicesViewPage } from "../invoices/view/invoices.view.page"; 
export const invoiceRoutes: Routes = [
    {
        path:"",
        component: InvoicesViewPage 
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(invoiceRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class InvoiceRouting { }
