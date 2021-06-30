import { NgModule } from"@angular/core";
import { RouterModule, Routes } from"@angular/router";
import { AuthGuard } from"@guards/auth.guard";
import { NotFoundComponent } from "./notFound/notFound.component";
import { PrintComponent } from "./print/print.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "notFound",
        component: NotFoundComponent
    },
    {
        path: "print/:type",
        component: PrintComponent,
        canActivate: [AuthGuard]
    }, 
    {
        path: "home",
        loadChildren: () => import("@pages/home/home.module").then(x => x.HomeModule),
        canActivate: [AuthGuard]
    },
    {
        path: "items",
        loadChildren: () => import("@pages/item/item.pages.module").then(x => x.ItemPagesModule),
        canActivate: [AuthGuard]
    },
    {
        path: "workPlans",
        loadChildren: () => import("@pages/workPlan/workPlan.pages.module").then(x => x.WorkPlanPagesModule),
        canActivate: [AuthGuard]
    },{
        path: "recipes",
        loadChildren: () => import("@pages/recipes/recipes.module").then(x => x.RecipesModule),
        canActivate: [AuthGuard]
    },/*
    {
        path: "home",
        loadChildren: () => import("@pages/invoice/invoice.module").then(x => x.InvoiceModule),
        canActivate: [AuthGuard]
    },*/
    {
        path: "inventories",
        loadChildren: () => import("@pages/inventory/inventory.pages.module").then(x => x.InventoryPagesModule),
        canActivate: [AuthGuard]
    },
    {
        path: "wallet",
        loadChildren: () => import("@pages/wallet/wallet.module").then(x => x.WalletModule),
        canActivate: [AuthGuard]
    },
    {
        path: "search",
        loadChildren: () => import("@pages/search/search.module").then(x => x.SearchModule),
        canActivate: [AuthGuard]
    },
    {
        path: "profile",
        loadChildren: () => import("@pages/profile/profile.module").then(x => x.ProfileModule),
        canActivate: [AuthGuard]
    },
    {
        path:"login",
        loadChildren: () => import("app/login/login.module").then(x => x.LoginModule)
    },
    {
        path: "categories",
        loadChildren: () => import("@pages/category/category.pages.module").then(x => x.CategoryPagesModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard
    ]
})
export class AppRouting { }
