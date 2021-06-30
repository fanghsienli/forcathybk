import { Injectable } from"@angular/core";
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,

    HttpEvent,
    HttpResponse,
    HttpErrorResponse
} from"@angular/common/http";
import { AppService } from"@services/app.service";
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: "root"})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        public router: Router,
        private appService: AppService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
       /* if (this.appService.token$.value) {
            const authReq = request.clone({ setHeaders: { Authorization: `Bearer ${this.appService.token$.value}` } });
            return next.handle(authReq);
        } else {
            const authReq = request.clone({ setHeaders: {} });
            return next.handle(authReq);
        }*/

        let token = localStorage.getItem("token");

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } 

        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.appService.logout();
                    this.router.navigate(['/login']);
                }
            }
        }));
    }
}
