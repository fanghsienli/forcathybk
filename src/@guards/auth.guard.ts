import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
} from "@angular/router";
import { AppService } from "@services/app.service";
import { SettingsService } from '../@services/settings.service';
import { Setting } from '../@models/setting';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private appService: AppService, private router: Router, public settingsService: SettingsService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.appService.isLoggedIn) { return true; }
        else {
            if (localStorage.getItem("token")) {
                this.settingsService.select().subscribe((setting: Setting) => {                   
                    this.appService.profile = setting.profile;
                    this.appService.isLoggedIn = true;
                });
                return true;
            }
            else this.appService.isLoggedIn = false;
        }
        // Store the attempted URL for redirecting
        this.appService.redirectUrl = url || "home";
        // Create a dummy session id
        //   let sessionId = 1;

        // Set our navigation extras object
        // that contains our global query params and fragment
        //  let navigationExtras: NavigationExtras = {
        //      queryParams: { 'session_id': sessionId },
        //      fragment: 'a'
        //  };

        // Navigate to the login page with extras
        this.router.navigate(['/login']
            //  , navigationExtras
        );
        return false;
    }
}
