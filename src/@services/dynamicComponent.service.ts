/*import { InquiryGeneralUpdateView } from"@pages/inquiries/generals/update/inquiryGeneralUpdate.view";
import { RecipeGeneralUpdateView } from"@pages/recipes/generals/update/recipeGeneralUpdate.view"
import { QuotationGeneralUpdateView } from"@pages/quotations/generals/update/quotationGeneralUpdate.view"
import { OrderGeneralUpdateView } from"@pages/orders/generals/update/orderGeneralUpdate.view"*/
import { Injectable } from"@angular/core";

@Injectable({providedIn: "root"})
export class DynamicComponentService {
    private components = {
       /* inquiryGeneralUpdateView: InquiryGeneralUpdateView,
        recipeGeneralUpdateView: RecipeGeneralUpdateView,
        quotationGeneralUpdateView: QuotationGeneralUpdateView,
        orderGeneralUpdateView: OrderGeneralUpdateView*/
    }
    constructor() { }

    getComponent(componentName: string) {
        return this.components[componentName];
    }
}