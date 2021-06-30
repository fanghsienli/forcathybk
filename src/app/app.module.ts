import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpService } from "@services/http.service";
import { AppRouting } from "./app.routing";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "environments/environment";
import { AuthInterceptor } from "@interceptors/auth.interceptor";
import { AppService } from "@services/app.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http"; 
import { ActivitiesComponent } from "@pages/activities/activities.component";
import { RouterModule } from "@angular/router"; 

import { NotFoundComponent } from "app/notFound/notFound.component";
import { BottomNavComponent } from "app/bottomNav/bottomNav.component";
import { TopComponent } from "app/top/top.component";
import { PrintComponent } from "app/print/print.component";
import { OfficeFooterComponent } from "app/officeFooter/officeFooter.component";
import { OfficeHeaderComponent } from "app/officeHeader/officeHeader.component";
import { PresentationComponent } from "app/presentation/presentation.component";
import { BottomActionComponent } from "app/bottomAction/bottomAction.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule, RouterState } from "@ngrx/router-store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { ROOT_REDUCERS, metaReducers } from "@reducers";
import { CoreModule } from "./core";
import { TempletesModule } from "@templetes/templetes.module";
import { RouterEffects } from "@effects/router.effects";
import { PresentationEffects } from "@effects/presentation.effects";
@NgModule({
    declarations: [
        PrintComponent,
        AppComponent,
        ActivitiesComponent,
        BottomNavComponent,
        TopComponent,
        BottomActionComponent,
        OfficeFooterComponent,
        OfficeHeaderComponent,
        PresentationComponent,
        NotFoundComponent
    ],
    imports: [
        CoreModule,
        TempletesModule, 
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({
            appId: "serverApp"
        }),
        AppRouting,
        HttpClientModule, 
        ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
        RouterModule, 
        StoreModule.forRoot(ROOT_REDUCERS, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictStateSerializability: true,
                strictActionSerializability: true,
            },
        }),
        StoreRouterConnectingModule.forRoot({
            routerState: RouterState.Minimal,
        }),
        StoreDevtoolsModule.instrument({
            name: "NgRx Inventory Store App"
        }),
        EffectsModule.forRoot([
            PresentationEffects,
            RouterEffects
        ])
    ],
    providers: [
        HttpService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
