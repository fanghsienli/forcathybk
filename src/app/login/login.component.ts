import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AppService } from "@services/app.service";
import { Observable, Subscription } from "rxjs";
import { Presentation } from "@models/app.model";
import { CurrentUserModel } from "@models/login";
import * as LayoutActions from "@actions/layout.actions";
import * as reducers from "@reducers";
import { Store } from "@ngrx/store";
@Component({
    selector: "login",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"],
    host: { "role": "main", "class": "SCxLW uzKWK", "style": "align-items:stretch;border:0 solid #000;box-sizing:border-box;display:flex;flex-direction:column;flex-shrink:0;margin:0;padding:0;position:relative" }
})

export class LoginComponent implements OnInit {

    settingSubscription: Subscription;
    presentation$: Observable<Presentation> = this.appService.presentation$;
    aspNetUser: FormGroup;
    passwordType: string = "password";
    app: any;
    appSubscription: Subscription;
    username: string;
    password: string;
    usernameFocused: boolean;
    passwordFocused: boolean;
    logining: boolean;
    constructor(
        public store: Store<reducers.State>,
        public appService: AppService,
        public router: Router) {
        this.passwordType = "password";
        this.usernameFocused = false;
        this.passwordFocused = false;
        this.username = "";
        this.password = "";
        this.logining = false;
    }


    ngOnDestroy() { }

    ngOnInit() {         
        this.store.dispatch(LayoutActions.setTopLeft({ left: null }));
        this.store.dispatch(LayoutActions.setTopTitle({ title: null }));
        this.store.dispatch(LayoutActions.setTopRight({ right: "空白" })); 
        this.appService.bottom$.next(null);
        this.appService.logout(); 
    } 

    togglePasswordType() {
        this.passwordType = this.passwordType === "text" ? "password" : "text";
    }
    login() {
        this.logining = true;

        this.appService.login(this.username, this.password).subscribe((x: any) => {
                if (x.message && x.message === "帳號密碼錯誤") {
                    this.appService.presentation$.next({
                        action: "錯誤",
                        h3: "密碼不正確",
                        div: "你輸入的密碼不正確，請再試一次。",
                        p: "很抱歉，你的密碼不正確，請再次檢查密碼。",
                        button: "再試一次"
                    });
                    this.logining = false;
                }
                else {
                    let user = (x as CurrentUserModel);
                    localStorage.setItem("token", user.token);
                    localStorage.setItem("userName", user.userName);
                    this.appService.getInventory().then(() => {
                        
                        this.router.navigate([this.appService.redirectUrl]);
                        this.logining = false;
                    })
                }
               
            });
   
    }

    adlogin() {
        this.appService.ad().subscribe(() => {
            if (this.appService.isLoggedIn) {
                let redirect = this.appService.redirectUrl ? this.appService.redirectUrl : "/home";
                this.router.navigate([redirect]);
            }
        });
    }

    logout() {
        this.appService.logout();
    }
}
